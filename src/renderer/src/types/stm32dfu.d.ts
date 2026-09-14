declare module 'stm32dfu' {
  type DfuInterface = {
    device: USBDevice
    configuration: USBConfiguration
    interface: USBInterface
    alternate: USBAlternateInterface
    name?: string
  }

  type Stm32Dfu = {
    findAllDeviceDfuInterfaces(devices: USBDevice[]): Promise<DfuInterface[]>
    getDfu(device: USBDevice, settings: DfuInterface): any
  }

  const stm32dfu: Stm32Dfu
  export default stm32dfu
}
