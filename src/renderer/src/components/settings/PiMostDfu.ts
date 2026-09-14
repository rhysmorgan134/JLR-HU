import stm32dfu from 'stm32dfu'

type StatusHandler = (status: string) => void
type ProgressHandler = (progress: number) => void

export default class PiMostDfu {
  private device: any = null
  private dfu: any = null
  private flashEnd = 0x0800c000 + 102400

  constructor(
    private readonly onStatus: StatusHandler,
    private readonly onProgress: ProgressHandler
  ) {}

  async connect(): Promise<string> {
    const usb = (navigator as any).usb
    if (!usb) throw new Error('WebUSB is not available')
    // STMicroelectronics uses vendor ID 0x0483 for many devices, including
    // ST-Link programmers. Restrict this request to the STM32 ROM DFU
    // bootloader so WebUSB cannot select and then attempt to claim an ST-Link.
    const selectedDevice = await usb.requestDevice({
      filters: [{ vendorId: 0x0483, productId: 0xdf11 }]
    })

    // Let stm32dfu inspect the descriptors and select the DFU configuration,
    // interface and alternate setting. The previous implementation assumed
    // configuration 1/interface 0, which is not reliable across platforms.
    const interfaces = await stm32dfu.findAllDeviceDfuInterfaces([selectedDevice])
    if (!interfaces.length) throw new Error('The selected device has no DFU interface')
    const selectedInterface = interfaces[0]
    // stm32dfu 0.2.0 can lose the alternate interface string while copying
    // descriptors into DeviceSettings. DFUse needs that string to construct
    // the flash sector map. Prefer WebUSB's descriptor and use the standard
    // STM32F4 internal-flash layout only when Chromium did not expose it.
    selectedInterface.name =
      selectedInterface.name ||
      selectedInterface.alternate.interfaceName ||
      '@Internal Flash /0x08000000/04*016Kg,01*064Kg,03*128Kg'
    this.device = selectedInterface.device
    this.dfu = stm32dfu.getDfu(this.device, selectedInterface)
    this.dfu.log = {
      debug: () => undefined,
      info: (...values: unknown[]) => this.onStatus(values.join(' ')),
      warn: (...values: unknown[]) => console.warn(...values),
      error: (...values: unknown[]) => console.error(...values)
    }
    this.dfu.progressHandler = (done: number, total: number) => {
      this.onProgress(total > 0 ? (done / total) * 100 : done)
    }

    const initialStatus = await this.dfu.getStatus()
    if (initialStatus.state === 10 || initialStatus.status !== 0) {
      await this.dfu.clearStatus()
    }
    this.onStatus('Connected')
    return this.device.serialNumber || 'Unknown'
  }

  async update(binary: ArrayBuffer): Promise<void> {
    if (!this.device?.opened) await this.connect()
    if (binary.byteLength > this.flashEnd - 0x0800c000) {
      throw new Error('Firmware image is larger than the available application flash')
    }
    try {
      this.onStatus('Erasing')
      await this.dfu.loadMemoryInfo()
      const descriptor = await this.dfu.getDFUDescriptorProperties()
      if (!descriptor.CanDnload) throw new Error('The selected DFU interface cannot download firmware')

      const currentStatus = await this.dfu.getStatus()
      if (currentStatus.state === 10 || currentStatus.status !== 0) {
        await this.dfu.clearStatus()
      }

      this.onStatus('Programming')
      this.dfu.startAddress = 0x0800c000
      await this.dfu.do_download(
        descriptor.TransferSize || 2048,
        new Uint8Array(binary),
        false
      )
      this.onStatus('Booting')
      await this.dfu.manifestationToNew(0x0800c000)
      this.onStatus('Complete')
    } finally {
      await this.disconnect()
    }
  }

  private async disconnect(): Promise<void> {
    if (this.device?.opened) await this.device.close().catch(() => undefined)
    this.device = null
    this.dfu = null
  }
}
