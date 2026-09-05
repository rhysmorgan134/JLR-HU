type StatusHandler = (status: string) => void
type ProgressHandler = (progress: number) => void

export default class PiMostDfu {
  private device: any = null
  private flashEnd = 0x0800c000 + 102400
  private readonly pageSize = 2048

  constructor(
    private readonly onStatus: StatusHandler,
    private readonly onProgress: ProgressHandler
  ) {}

  async connect(): Promise<string> {
    const usb = (navigator as any).usb
    if (!usb) throw new Error('WebUSB is not available')
    this.device = await usb.requestDevice({ filters: [{ vendorId: 0x0483 }] })
    await this.device.open()
    if (!this.device.configuration) await this.device.selectConfiguration(1)
    await this.device.claimInterface(0)
    await this.clearStatus()
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
      await this.erase()
      this.onStatus('Programming')
      await this.program(binary)
      this.onStatus('Booting')
      await this.detach()
      this.onStatus('Complete')
    } finally {
      await this.disconnect()
    }
  }

  private async status(): Promise<number> {
    const result = await this.device.controlTransferIn(
      { requestType: 'class', recipient: 'interface', request: 0x03, value: 0, index: 0 },
      6
    )
    const error = result.data.getUint8(0)
    const wait = result.data.getUint8(1) | (result.data.getUint8(2) << 8) | (result.data.getUint8(3) << 16)
    const state = result.data.getUint8(4)
    if (wait) await new Promise((resolve) => setTimeout(resolve, wait))
    if (error !== 0 || state === 10) throw new Error(`DFU error ${error} in state ${state}`)
    return state
  }

  private async clearStatus(): Promise<void> {
    const result = await this.device.controlTransferOut(
      { requestType: 'class', recipient: 'interface', request: 0x04, value: 0, index: 0 }
    )
    if (result.status !== 'ok') throw new Error('Could not clear DFU status')
  }

  private command(data: Uint8Array, value = 0): Promise<any> {
    return this.device.controlTransferOut(
      { requestType: 'class', recipient: 'interface', request: 0x01, value, index: 0 },
      data
    )
  }

  private async erase(): Promise<void> {
    const start = 0x0800c000
    const pages = Math.ceil((this.flashEnd - start) / this.pageSize)
    for (let address = start, page = 0; address < this.flashEnd; address += this.pageSize, page++) {
      await this.command(new Uint8Array([0x41, address & 0xff, (address >> 8) & 0xff, (address >> 16) & 0xff, (address >> 24) & 0xff]))
      await this.status()
      await this.status()
      this.onProgress((page / pages) * 45)
    }
  }

  private async program(binary: ArrayBuffer): Promise<void> {
    await this.command(new Uint8Array([0x21, 0x00, 0xc0, 0x00, 0x08]))
    await this.status()
    await this.status()
    const blocks = Math.ceil(binary.byteLength / 2048)
    for (let block = 0; block < blocks; block++) {
      const chunk = new Uint8Array(binary.slice(block * 2048, (block + 1) * 2048))
      await this.command(chunk, block + 2)
      await this.status()
      await this.status()
      this.onProgress(45 + ((block + 1) / blocks) * 55)
    }
  }

  private async detach(): Promise<void> {
    await this.device.controlTransferOut(
      { requestType: 'class', recipient: 'interface', request: 0x01, value: 0, index: 0 }
    )
    try { await this.status() } catch { /* Device normally resets before replying. */ }
  }

  private async disconnect(): Promise<void> {
    if (this.device?.opened) await this.device.close().catch(() => undefined)
    this.device = null
  }
}
