import { FBlock } from './common'
import { MostRxMessage, Os8104Events } from 'socketmost'
import {
  DeckEvent,
  DeckStatus,
  Device,
  FBlockMap,
  MediaEvent,
  NetworkStatus,
  OpType,
  Random,
  Repeat,
  TunerTypes
} from './types'
import { SocketMostUsb } from 'socketmost'
import { Socket } from '../Socket'
import { Action } from '../Globals'

const cdPlayer: Device = { addressHigh: 0x01, addressLow: 0x80, fBlockID: 0x31, instanceID: 0x02 }
const cdPlayerFunctions = [
  0x0, 0x01, 0x02, 0x90, 0x91, 0x92, 0x101, 0x102, 0x200, 0x201, 0x202, 0x412, 0x413, 0x420, 0x430,
  0x431, 0x450, 0x451, 0x452, 0xc11, 0xc12, 0xc13, 0xc14, 0xc20, 0xc21, 0xc31, 0xc33, 0xc35
]
const cdPlayerShadow: Device = {
  addressHigh: 0x01,
  addressLow: 0x61,
  fBlockID: 0x31,
  instanceID: 0xa1
}
const cdPlayerShadowFunctions = [0x00, 0xc80, 0xc81, 0xe00]
const carplay: Device = { addressHigh: 0x1, addressLow: 0x89, fBlockID: 0x31, instanceID: 0x5 }
const carplayFunctions = [
  0x0, 0x01, 0x90, 0x91, 0x92, 0x101, 0x102, 0x200, 0x201, 0x202, 0x412, 0x413, 0x420, 0x430, 0x431,
  0x450, 0x451, 0x452, 0xc11, 0xc13, 0xc31, 0xc32, 0xc33, 0xc34
]
const carplayShadow: Device = {
  addressHigh: 0x01,
  addressLow: 0x6e,
  fBlockID: 0x31,
  instanceID: 0xa2
}
const carplayShadowFunctions = [0x00, 0xc80, 0xc81, 0xe00]
const amFmTuner: Device = { addressHigh: 0x01, addressLow: 0x80, fBlockID: 0x40, instanceID: 0x01 }
const amFmTunerFunctions = [
  0x0, 0x1, 0x2, 0x101, 0x102, 0x103, 0xd00, 0xd01, 0xd02, 0xd03, 0xd05, 0xd08, 0xd09, 0xd0a, 0xd0b,
  0xd0c, 0xd0e, 0xd10, 0xd11, 0xd13, 0xd14, 0xd15, 0xd17, 0xd18, 0xd40, 0xd50
]
const amFmTunerShadow: Device = {
  addressHigh: 0x01,
  addressLow: 0x16e,
  fBlockID: 0x40,
  instanceID: 0xa1
}
const amFmTunerShadowFunctions = [0x00, 0x01, 0x02, 0xc80, 0xc81, 0xd19, 0xe00]
const amplifier: Device = { addressHigh: 0x01, addressLow: 0x86, fBlockID: 0x22, instanceID: 0x05 }
const amplifierFunctions = [
  0x00, 0x01, 0x02, 0x111, 0x112, 0x113, 0x202, 0x203, 0x427, 0x430, 0x431, 0x441, 0x461, 0x466,
  0x46d, 0xe04, 0xe05, 0xe07, 0xe08
]
const amplifierShadow: Device = {
  addressHigh: 0x01,
  addressLow: 0x6e,
  fBlockID: 0x22,
  instanceID: 0xd1
}
const amplifierShadowFunctions = [0x00, 0xda0, 0xda1]
const x11: Device = { addressHigh: 0x1, addressLow: 0x6e, fBlockID: 0x11, instanceID: 0xd1 }
const x11Functions = [0x00]
const x11Shadow: Device = null
const x52: Device = { addressHigh: 0x01, addressLow: 0x6e, fBlockID: 0x52, instanceID: 0xd1 }
const x52Shadow: Device = null
const diagnosis: Device = { addressHigh: 0x01, addressLow: 0x6e, fBlockID: 0x06, instanceID: 0x6e }
const diagnosisShadow: Device = null
const auxInput: Device = { addressHigh: 0x01, addressLow: 0x80, fBlockID: 0x24, instanceID: 0x01 }
const auxInputFunctions = [0x0, 0x101, 0x102, 0xd00]
const auxInputShadow: Device = {
  addressHigh: 0x01,
  addressLow: 0x6e,
  fBlockID: 24,
  instanceID: 0xa1
}
const hmi: Device = { addressHigh: 0x01, addressLow: 0x6e, fBlockID: 0x10, instanceID: 0xa3 }
const x10Functions = [
  0x0, 0x01, 0x2, 0x101, 0x102, 0xc00, 0xc02, 0xc80, 0xc81, 0xca1, 0xca3, 0xe00, 0xe01
]
const hmiShadow: Device = null
const graphicDisplay: Device = {
  addressHigh: 0x01,
  addressLow: 0x6e,
  fBlockID: 0x60,
  instanceID: 0x01
}
const graphicDisplayFunctions = [0x0, 0x01, 0x02, 0xc00, 0xc01, 0xc02, 0xdb0]
const graphicDisplayShadow: Device = null
const telephone: Device = { addressHigh: 0x01, addressLow: 0x90, fBlockID: 0x50, instanceID: 0x01 }
const telephoneFunctions = [
  0x01, 0x02, 0x101, 0x102, 0x111, 0x112, 0x113, 0x202, 0x250, 0x251, 0x253, 0x254, 0x255, 0x25a,
  0x421, 0x423, 0x426, 0x427, 0x441, 0x443, 0x446, 0xc00, 0xc01, 0xc02
]
const telephoneShadow: Device = {
  addressHigh: 0x01,
  addressLow: 0x6e,
  fBlockID: 0x50,
  instanceID: 0xa1
}
const telephoneShadowFunctions = [0x0, 0x01, 0x02, 0xc03, 0xc80, 0xc81, 0xe00]
const vehicle1: Device = { addressHigh: 0x01, addressLow: 0x6e, fBlockID: 0x05, instanceID: 0xd1 }
const vehicle1Functions = [0x00, 0xda0, 0xda1]
const vehicle1Shadow: Device = null
const vehicle2: Device = { addressHigh: 0x01, addressLow: 0x6e, fBlockID: 0x05, instanceID: 0xd2 }
const vehicle2Functions = [0x00, 0xda0, 0xda1]
const SDARS: Device = null
const SDARSSshadow: Device = {
  addressHigh: 0x01,
  addressLow: 0x6e,
  fBlockID: 0x44,
  instanceID: 0xa1
}
const SDARSshadowFunctions = [0x0, 0xc80, 0xc81, 0xe00]
const DABTuner: Device = null
const DABTunerShadow: Device = {
  addressHigh: 0x01,
  addressLow: 0x6e,
  fBlockID: 0x43,
  instanceID: 0xa1
}
const DABTunerShadowFunctions = [0x00, 0xc80, 0xc81, 0xe00]
const TVTuner: Device = null
const TVTunerShadow: Device = {
  addressHigh: 0x01,
  addressLow: 0x6e,
  fBlockID: 0x42,
  instanceID: 0xa1
}
const TVTunerShadowFunctions = [0x00, 0xc80, 0xc81, 0xe00]

const f5Subscriptions = [0xc11, 0x303]
const f5Subscriptions2 = [
  0xe15, 0xe0f, 0xe0b, 0xe0a, 0xa04, 0xe08, 0xe23, 0xe17, 0x301, 0x302, 0xe20, 0xe21, 0xe05, 0xe1a,
  0xe1b, 0xe18, 0xe09, 0xe24, 0xe27, 0xe2a, 0xe29, 0x409
]

const audioControl: Device = {
  addressHigh: 0x01,
  addressLow: 0x61,
  fBlockID: 0xf0,
  instanceID: 0x01
}
//interesting stuff, 0x180 subscribes to 303 in master. 0x186 subscribes 303 in master. 0x189 subscribes 0x303 master,

// const netblock:Device = {addressHigh: 0x01, addressLow: 0x6e,}
export class HMI extends FBlock {
  status: Object
  constructor(
    subscriptions: number[],
    socketmost: SocketMostUsb,
    autoSubscribe: boolean,
    socket: Socket
  ) {
    super(subscriptions, null, null, socketmost, autoSubscribe, socket)
    this.status = {
      0xc02: 0x01
    }
  }

  allocate(message: MostRxMessage): void {}

  deallocate(message: MostRxMessage): void {}

  parseMessage(message: MostRxMessage): void {}

  parseShadowMessage(message: MostRxMessage): void {}

  startSource(): void {}

  stopSource(): void {}

  0xc81(message: MostRxMessage) {
    if (message.data[0] === 0x00) {
      this.logger.info(
        `shadow ${message.fBlockID.toString(16)} instID ${message.instanceID.toString(16)} active`
      )
      this.socketmost.sendControlMessage(this.createResponseMessage(message, [], OpType.status))
      this.emit('HMIActive')
      setTimeout(() => {
        this.updateStatus({ screensaver: false })
      }, 500)

      if (this.autoSubscribe && this.subscriptions.length > 0) {
        this.subscribe()
      }
    } else if (message.data[0] === 0x02) {
      this.logger.info(
        `shadow ${message.fBlockID.toString(16)} instID ${message.instanceID.toString(16)} standby`
      )
      this.socketmost.sendControlMessage(this.createResponseMessage(message, [], OpType.status))
      this.emit('HMIShutdown')
      setTimeout(() => {
        this.updateStatus({ screensaver: true })
      }, 200)
    } else if (message.data[0] === 0x03) {
      this.logger.info(
        `shadow ${message.fBlockID.toString(16)} instID ${message.instanceID.toString(16)} disabled`
      )
      this.emit('HMIShutdown')
      setTimeout(() => {
        this.updateStatus({ screensaver: true })
      }, 200)
      this.socketmost.sendControlMessage(this.createResponseMessage(message, [], OpType.status))
    }
  }

  // 0xe00(message: MostRxMessage) {
  //   // switch (message.opType) {
  //   //   case OpType.set:
  //   //     if (message.data[0] === 0x02 && message.data[1] === 0x01) {
  //   //       this.socket.sendStatusUpdate('hmi', { screensaver: true })
  //   //     } else if (message.data[0] === 0x01 && message.data[1] === 0x01) {
  //   //       setTimeout(() => {
  //   //         this.socket.sendStatusUpdate('hmi', { screensaver: false })
  //   //       }, 5000)
  //   //     }
  //   // }
  // }
}

export class CanGateway extends FBlock {
  constructor(
    subscriptions: number[],
    socketmost: SocketMostUsb,
    autoSubscribe: boolean,
    socket: Socket
  ) {
    super(subscriptions, cdPlayer, cdPlayerShadow, socketmost, autoSubscribe, socket)
  }

  allocate(message: MostRxMessage): void {}

  deallocate(message: MostRxMessage): void {}

  parseMessage(message: MostRxMessage): void {}

  parseShadowMessage(message: MostRxMessage): void {}

  startSource(): void {}

  stopSource(): void {}
}

export class NetBlock extends FBlock {
  implementedFblocks: number[]
  registry: Object

  constructor(
    subscriptions: number[],
    socketmost: SocketMostUsb,
    autoSubscribe: boolean,
    socket: Socket
  ) {
    super(subscriptions, null, null, socketmost, autoSubscribe, socket)
    this.implementedFblocks = [
      0x10, 0xa3, 0x06, 0x6e, 0x40, 0xa1, 0x31, 0xa1, 0x52, 0xd1, 0x60, 0x01, 0x50, 0xa1, 0x05,
      0xd1, 0x24, 0xa1, 0x22, 0xd1, 0x11, 0xd1, 0x44, 0xa1, 0x05, 0xd2, 0x42, 0xa1, 0x31, 0xa2,
      0x43, 0xa1, 0x31, 0xa2
    ]
    this.registry = {}
  }

  allocate(message: MostRxMessage): void {}

  deallocate(message: MostRxMessage): void {}

  parseMessage(message: MostRxMessage): void {}

  parseShadowMessage(message: MostRxMessage): void {}

  checkMessage(message: MostRxMessage) {
    try {
      this[message.fktID](message)
    } catch {
      this.logger.info('unhandled message', this.convertMessageToHex(message))
    }
  }

  0x00(message: MostRxMessage) {
    switch (message.opType) {
      case OpType.get:
        this.socketmost.sendControlMessage(
          this.createResponseMessage(message, this.implementedFblocks, OpType.status)
        )
        this.logger.debug(
          'fblocks sent' +
            this.convertMessageToHex(
              this.createResponseMessage(message, this.implementedFblocks, OpType.status)
            )
        )
    }
  }

  startSource(): void {}

  stopSource(): void {}
}

export class AmFmTuner extends FBlock {
  status: Object
  fm1: Record<number, { stationName: string; frequency: number }>
  fm2: Record<number, { stationName: string; frequency: number }>
  fma: Record<number, { stationName: string; frequency: number }>
  am: Record<number, { stationName: string; frequency: number }>

  constructor(
    subscriptions: number[],
    socketmost: SocketMostUsb,
    autoSubscribe: boolean,
    socket: Socket
  ) {
    super(subscriptions, amFmTuner, amFmTunerShadow, socketmost, autoSubscribe, socket)

    this.status = {}
    this.fm1 = {}
    this.fm2 = {}
    this.fma = {}
    this.am = {}
  }

  allocate(message: MostRxMessage): void {}

  deallocate(message: MostRxMessage): void {}

  parseMessage(message: MostRxMessage): void {}

  parseShadowMessage(message: MostRxMessage): void {}

  async startSource(): Promise<void> {
    await new Promise<void>((resolve) => {
      const onMessageSent = () => {
        this.socketmost.off(Os8104Events.MessageSent, onMessageSent)
        this.subscribeAll()
        resolve()
      }

      this.socketmost.once(Os8104Events.MessageSent, onMessageSent)

      this.socketmost.sendControlMessage(this.physicalMessage(OpType.setGet, 0x103, [0x01, 0x02]))
    })
  }

  0x103(message: MostRxMessage): void {
    this.logger.debug(`AmFmTuner source state: ${message.data.toString('hex')}`)
  }

  async stopSource(): Promise<void> {
    await new Promise<void>((resolve) => {
      const onMessageSent = () => {
        this.socketmost.off(Os8104Events.MessageSent, onMessageSent)
        resolve()
      }

      this.socketmost.once(Os8104Events.MessageSent, onMessageSent)

      this.socketmost.sendControlMessage(this.physicalMessage(OpType.setGet, 0x103, [0x01, 0x00]))
    })

    this.unsubscribe()
  }
  // 0xd50(message: MostRxMessage) {
  //   switch (message.opType) {
  //     case OpType.status:
  //       const stringTermination = message.data.indexOf(0x00, 2)
  //       const data = {
  //         title: message.data.subarray(3, stringTermination).toString(),
  //       }
  //   }
  // }
  seekForward() {
    this.socketmost.sendControlMessage(this.physicalMessage(OpType.setGet, 0xd03, [0x11]))
  }

  seekBack() {
    this.socketmost.sendControlMessage(this.physicalMessage(OpType.setGet, 0xd03, [0x31]))
  }
  autostore() {
    this.socketmost.sendControlMessage(this.physicalMessage(OpType.setGet, 0xd13, [0x04, 0x09]))
  }

  0xd01(message: MostRxMessage): void {
    const stringTermination = message.data.indexOf(0x00, 2)
    this.logger.debug('string termination: ' + stringTermination)
    const data = {
      radioText: message.data.subarray(2, stringTermination).toString(),
      frequency: message.data.readUInt32BE(stringTermination + 2),
      preset: message.data.readUInt8(0)
    }
    this.updateStatus(data)
  }

  0xd15(message: MostRxMessage): void {
    const end = message.data.indexOf(0x00, 2)

    const text = message.data.subarray(2, end === -1 ? message.data.length : end).toString('utf8')

    this.logger.info(`0xd0c: ${text}`)

    this.updateStatus({
      nowPlaying: text
    })
  }

  0xd0c(message: MostRxMessage): void {
    const text = message.data.subarray(2, message.data.indexOf(0x00, 2)).toString()

    this.logger.info(`Now Playing: ${text}`)

    this.updateStatus({
      nowPlaying: text
    })
  }

  0xd50(message: MostRxMessage): void {
    if (message.data.length < 13) {
      this.logger.error(`invalid 0xd50 payload: ${message.data.toString('hex')}`)
      return
    }

    const presetGroup = message.data.readUInt8(0)
    const presetNo = message.data.readUInt8(1)
    const stringTermination = message.data.indexOf(0x00, 8)
    const bank = TunerTypes[presetGroup] as 'fm1' | 'fm2' | 'am' | 'fma' | undefined

    if (!bank || stringTermination === -1 || stringTermination + 5 > message.data.length) {
      this.logger.error(`invalid 0xd50 payload: ${message.data.toString('hex')}`)
      return
    }

    this[bank][presetNo] = {
      stationName: message.data.subarray(8, stringTermination).toString(),
      frequency: message.data.readUInt32BE(stringTermination + 1)
    }

    this.updateStatus({ [bank]: { ...this[bank] } })
  }

  selectPreset(data: { bank: keyof typeof TunerTypes; preset: number }): void {
    const presetGroup = TunerTypes[data.bank]
    if (typeof presetGroup !== 'number' || data.preset < 1 || data.preset > 9) return

    this.socketmost.sendControlMessage(
      this.physicalMessage(OpType.setGet, 0xd11, [presetGroup, data.preset])
    )
  }

  savePreset(data: { bank: keyof typeof TunerTypes; preset: number }): void {
    const presetGroup = TunerTypes[data.bank]
    if (typeof presetGroup !== 'number' || data.preset < 1 || data.preset > 9) return

    this.socketmost.sendControlMessage(
      this.physicalMessage(OpType.setGet, 0xd10, [presetGroup, data.preset])
    )
  }

  // export type PresetGroupType = Record<PresetGroupTypes, string>
  //
  // export const SET_PRESET_GROUP = (
  //   prevPreset: number,
  //   PresetGroupType: keyof typeof PresetGroupTypes
  // ): Action => {
  //   return {
  //     fktID: 0xd00,
  //     opType: 0x02,
  //     data: [PresetGroupType.includes('fm') ? 0x01 : 0x02, 3, 6, PresetGroupTypes[PresetGroupType]],
  //     type: 'AmFmTuner',
  //     method: 'methods'
  //   }
  // }

  setTunerType(data: { type: keyof typeof TunerTypes }): void {
    const presetGroup = TunerTypes[data.type]
    if (typeof presetGroup !== 'number') return

    const tuner = data.type.startsWith('fm') ? 0x01 : 0x02
    this.socketmost.sendControlMessage(
      this.physicalMessage(OpType.setGet, 0xd00, [tuner, 0x03, 0x06, presetGroup])
    )
    this.getPresets(presetGroup)
  }

  getPresets(type = 0) {
    this.socketmost.sendControlMessage(this.physicalMessage(OpType.get, 0xd50, [0x00, 0x00, type]))
  }
}

export class AuxInput extends FBlock {
  status: Object
  constructor(
    subscriptions: number[],
    socketmost: SocketMostUsb,
    autoSubscribe: boolean,
    socket: Socket
  ) {
    super(subscriptions, auxInput, auxInputShadow, socketmost, autoSubscribe, socket)
    this.status = {}
  }

  allocate(message: MostRxMessage): void {}

  deallocate(message: MostRxMessage): void {}

  parseMessage(message: MostRxMessage): void {}

  parseShadowMessage(message: MostRxMessage): void {}

  startSource(): void {}

  stopSource(): void {}
}

export class AudioDiskPlayer extends FBlock {
  status: Object

  constructor(
    subscriptions: number[],
    socketmost: SocketMostUsb,
    autoSubscribe: boolean,
    socket: Socket
  ) {
    super(subscriptions, cdPlayer, cdPlayerShadow, socketmost, autoSubscribe, socket)
    this.status = {
      deckStatus: null
    }
    this.room = 'audioDiskPlayer'
  }

  allocate(message: MostRxMessage): void {}

  deallocate(message: MostRxMessage): void {}

  parseMessage(message: MostRxMessage): void {}

  parseShadowMessage(message: MostRxMessage): void {}

  async startSource() {
    return new Promise((resolve, reject) => {
      this.play()
      this.socketmost.once(Os8104Events.MessageSent, () => {
        this.subscribeAll()
        resolve(1)
      })
    })
  }

  async stopSource() {
    return new Promise((resolve, reject) => {
      this.unsubscribe()
      setTimeout(() => {
        this.socketmost.sendControlMessage(this.physicalMessage(OpType.set, 0x200, [0x01]))
        setTimeout(() => {
          resolve(1)
        }, 1)
      }, 1)
    })
  }

  0x200(message: MostRxMessage) {
    //Deck status
    switch (message.opType) {
      case OpType.status:
        this.updateStatus({ deckStatus: DeckStatus[message.data[0]] })
    }
  }

  0x201(message: MostRxMessage) {
    switch (message.opType) {
      case OpType.status:
        switch (message.data[0]) {
          case 0x0:
            this.updateStatus({
              diskTime: message.data.readUInt32BE(2),
              trackTime: message.data.readInt32BE(6),
              titleTime: message.data.readUInt32BE(10)
            })
            break
          case 0x01:
            this.updateStatus({ diskTime: message.data.readUInt32BE(2) })
            break
          case 0x02:
            this.updateStatus({ trackTime: message.data.readUInt32BE(2) })
            break
          case 0x03:
            this.updateStatus({ titleTime: message.data.readUInt32BE(2) })
            break
          default:
            break
        }
    }
  }

  0x202(message: MostRxMessage) {
    switch (message.opType) {
      case OpType.status:
        this.updateStatus({ trackPosition: message.data.readUint16BE(0) })
    }
  }

  0x412(message: MostRxMessage) {
    switch (message.opType) {
      case OpType.status:
        this.updateStatus({ activeDisk: message.data.readUint8(0) })
    }
  }

  0x413(message: MostRxMessage) {
    switch (message.opType) {
      case OpType.status:
        const stringTermination = message.data.indexOf(0x00, 2)
        this.logger.debug('string termination: ' + stringTermination)
        const data = {
          title: message.data.subarray(3, stringTermination).toString(),
          type: message.data.readUInt8(stringTermination + 1),
          fileSystem: message.data.readUInt8(stringTermination + 2),
          firstTrack: message.data.readUint16BE(stringTermination + 3),
          lastTrack: message.data.readUint16BE(stringTermination + 5),
          totalPlayTime: message.data.readUint32BE(stringTermination + 7)
        }
        const pos = message.data.readInt8(0)
        let status = {}
        status['disk' + pos] = { ...data }

        this.updateStatus(status)
    }
  }

  0x420(message: MostRxMessage) {
    switch (message.opType) {
      case OpType.status:
        const stringTermination = message.data.indexOf(0x00, 2)
        this.logger.debug('string termination: ' + stringTermination)
        const status = {
          trackTitle: message.data.subarray(3, stringTermination).toString(),
          audioTime: message.data.readUint32BE(stringTermination + 1),
          trackNo: message.data.readUint16BE(stringTermination + 5)
        }
        this.updateStatus(status)
    }
  }

  0x430(message: MostRxMessage) {
    switch (message.opType) {
      case OpType.status:
        this.updateStatus({ deckEvent: DeckEvent[message.data.readUint8(0)] })
    }
  }

  0x431(message: MostRxMessage) {
    switch (message.opType) {
      case OpType.status:
        this.updateStatus({ mediaEvent: MediaEvent[message.data.readUint8(0)] })
    }
  }

  0x450(message: MostRxMessage) {
    switch (message.opType) {
      case OpType.status:
        this.updateStatus({ random: Random[message.data.readUint8(0)] })
    }
  }

  0x452(message: MostRxMessage) {
    switch (message.opType) {
      case OpType.status:
        this.updateStatus({ repeat: Repeat[message.data.readUint8(0)] })
    }
  }
  0xe00(message: MostRxMessage) {
    if (message.opType === OpType.set) {
      if (message.data[0] == 0x10 && message.data[1] === 0x01) {
        this.socketmost.sendControlMessage(this.physicalMessage(OpType.set, 0x200, [0x04]))
      }
    }
  }

  nextTrack() {
    this.socketmost.sendControlMessage(this.physicalMessage(OpType.increment, 0x202, [0x01]))
  }

  prevTrack() {
    this.socketmost.sendControlMessage(this.physicalMessage(OpType.decrement, 0x202, [0x01]))
  }

  play() {
    this.socketmost.sendControlMessage(this.physicalMessage(OpType.set, 0x200, [0x00]))
  }

  pause() {
    this.socketmost.sendControlMessage(this.physicalMessage(OpType.set, 0x200, [0x02]))
  }

  random({ random: Random }) {
    this.socketmost.sendControlMessage(this.physicalMessage(OpType.set, 0x450, [0x00]))
  }
}

export class Carplay extends FBlock {
  status: Object
  constructor(
    subscriptions: number[],
    socketmost: SocketMostUsb,
    autoSubscribe: boolean,
    socket: Socket
  ) {
    super(subscriptions, carplay, carplayShadow, socketmost, autoSubscribe, socket)
    this.status = {}
  }

  allocate(message: MostRxMessage): void {}

  deallocate(message: MostRxMessage): void {}

  parseMessage(message: MostRxMessage): void {}

  parseShadowMessage(message: MostRxMessage): void {}

  startSource(): void {}

  stopSource(): void {}
}

export class Telephone extends FBlock {
  status: Object
  constructor(
    subscriptions: number[],
    socketmost: SocketMostUsb,
    autoSubscribe: boolean,
    socket: Socket
  ) {
    super(subscriptions, telephone, telephoneShadow, socketmost, autoSubscribe, socket)
    this.status = {}
  }

  allocate(message: MostRxMessage): void {}

  deallocate(message: MostRxMessage): void {}

  parseMessage(message: MostRxMessage): void {}

  parseShadowMessage(message: MostRxMessage): void {}

  startSource(): void {}

  stopSource(): void {}
}

export class Satellite extends FBlock {
  status: Object
  constructor(
    subscriptions: number[],
    socketmost: SocketMostUsb,
    autoSubscribe: boolean,
    socket: Socket
  ) {
    super(subscriptions, SDARS, SDARSSshadow, socketmost, autoSubscribe, socket)
    this.status = {}
  }

  allocate(message: MostRxMessage): void {}

  deallocate(message: MostRxMessage): void {}

  parseMessage(message: MostRxMessage): void {}

  parseShadowMessage(message: MostRxMessage): void {}

  startSource(): void {}

  stopSource(): void {}
}

export class DabTuner extends FBlock {
  status: Object
  constructor(
    subscriptions: number[],
    socketmost: SocketMostUsb,
    autoSubscribe: boolean,
    socket: Socket
  ) {
    super(subscriptions, DABTuner, DABTunerShadow, socketmost, autoSubscribe, socket)
    this.status = {}
  }

  allocate(message: MostRxMessage): void {}

  deallocate(message: MostRxMessage): void {}

  parseMessage(message: MostRxMessage): void {}

  parseShadowMessage(message: MostRxMessage): void {}

  startSource(): void {}

  stopSource(): void {}
}

export class TvTuner extends FBlock {
  status: Object
  constructor(
    subscriptions: number[],
    socketmost: SocketMostUsb,
    autoSubscribe: boolean,
    socket: Socket
  ) {
    super(subscriptions, TVTuner, TVTunerShadow, socketmost, autoSubscribe, socket)
    this.status = {}
  }

  allocate(message: MostRxMessage): void {}

  deallocate(message: MostRxMessage): void {}

  parseMessage(message: MostRxMessage): void {}

  parseShadowMessage(message: MostRxMessage): void {}

  startSource(): void {
    this.socketmost.sendControlMessage(this.physicalMessage(OpType.setGet, 0x103, [0x01, 0x02]))
  }

  stopSource(): void {}
}

export class Diagnostics extends FBlock {
  status: Object
  constructor(
    subscriptions: number[],
    socketmost: SocketMostUsb,
    autoSubscribe: boolean,
    socket: Socket
  ) {
    super(subscriptions, null, null, socketmost, autoSubscribe, socket)
    this.status = {
      0xd22: [
        0xf1, 0x8c, 0x30, 0x38, 0x31, 0x37, 0x32, 0x30, 0x33, 0x32, 0x34, 0x30, 0x30, 0x30, 0x00,
        0x00, 0x00, 0x00
      ]
    }
  }

  allocate(message: MostRxMessage): void {}

  deallocate(message: MostRxMessage): void {}

  parseMessage(message: MostRxMessage): void {}

  parseShadowMessage(message: MostRxMessage): void {}

  0xd22(message) {
    this.logger.debug(
      `sending 0xd22 ${this.convertMessageToHex(
        this.createResponseMessage(message, this.status[0xd22], OpType.status)
      )}`
    )
    this.socketmost.sendControlMessage(
      this.createResponseMessage(message, this.status[0xd22], OpType.status)
    )
  }

  startSource(): void {}

  stopSource(): void {}
}

export class AudioControl extends FBlock {
  status: Object
  currentSource: FBlock | null
  constructor(
    subscriptions: number[],
    socketmost: SocketMostUsb,
    autoSubscribe: boolean,
    socket: Socket
  ) {
    super(subscriptions, audioControl, null, socketmost, autoSubscribe, socket)
    this.status = {
      currentSource: null,
      audioVolume: null,
      parkingVolumeFront: null,
      parkingVolumeRear: null,
      navigationVolume: null,
      phoneVolume: null
    }
    this.currentSource = null
  }

  allocate(message: MostRxMessage): void {}

  deallocate(message: MostRxMessage): void {}

  parseMessage(message: MostRxMessage): void {}

  parseShadowMessage(message: MostRxMessage): void {}

  0x409(message: MostRxMessage): void {
    this.logger.info(`AudioControl 0x409 received: ${this.convertMessageToHex(message)}`)

    if (message.data.length < 11) {
      this.logger.warn(`invalid AudioControl volume payload: ${this.convertMessageToHex(message)}`)
      return
    }

    this.updateStatus({
      audioVolume: message.data.readUInt8(2),
      phoneVolume: message.data.readUInt8(6),
      navigationVolume: message.data.readUInt8(8),
      parkingVolumeFront: message.data.readUInt8(10),
      parkingVolumeRear: message.data.readUInt8(10)
    })
  }

  getVolumes(): void {
    this.logger.info('requesting AudioControl volume status')
    this.socketmost.sendControlMessage(this.physicalMessage(OpType.get, 0x409, []))
  }

  startVolumeUpdates(): void {
    this.logger.info('subscribing to AudioControl notifications')
    this.subscribeAll()
    this.getVolumes()
  }

  async switchSource(device: FBlock) {
    this.logger.info('performing switch to ' + device)
    if (this.currentSource) {
      this.logger.info('source already active, stopping source')
      const data406 = [
        0x00,
        0x03,
        this.currentSource.shadowDevice.fBlockID,
        this.currentSource.shadowDevice.instanceID,
        0x01,
        0x01,
        this.currentSource.physicalDevice.fBlockID,
        this.currentSource.physicalDevice.instanceID,
        0x01,
        0x11
      ]
      const data408 = [
        0x00,
        0x02,
        this.currentSource.shadowDevice.fBlockID,
        this.currentSource.shadowDevice.instanceID,
        0x01,
        0x11
      ]
      await this.currentSource.stopSource()
      this.logger.info('stopped source')
      await this.sendMethod(this.physicalMessage(OpType.startResultAck, 0x406, data406))
      this.logger.info('406 complete')
      await this.sendMethod(this.physicalMessage(OpType.startResultAck, 0x408, data408))
      this.logger.info('408 complete')
    }

    const data405 = [
      0x00,
      0x02,
      device.shadowDevice.fBlockID,
      device.shadowDevice.instanceID,
      0x01,
      0x01,
      device.physicalDevice.fBlockID,
      device.physicalDevice.instanceID,
      0x01,
      0x11
    ]

    const data407 = [
      0x00,
      0x01,
      device.shadowDevice.fBlockID,
      device.shadowDevice.instanceID,
      0x01,
      0x11
    ]
    this.logger.debug(
      `sending ${this.convertMessageToHex(
        this.physicalMessage(OpType.startResultAck, 0x405, data405)
      )}`
    )
    let result = await this.sendMethod(this.physicalMessage(OpType.startResultAck, 0x405, data405))
    this.logger.info(`405 result ${result}`)
    result = await this.sendMethod(this.physicalMessage(OpType.startResultAck, 0x407, data407))

    this.logger.info(`407 result ${result}`)
    this.currentSource = device
    this.updateStatus({ currentSource: device.constructor.name })
    device.startSource()
  }

  startSource(): void {}

  stopSource(): void {}

  async stopPlayback() {
    console.log('stopping playback')
    if (this.currentSource) {
      const data406 = [
        0x00,
        0x03,
        this.currentSource.shadowDevice.fBlockID,
        this.currentSource.shadowDevice.instanceID,
        0x01,
        0x01,
        this.currentSource.physicalDevice.fBlockID,
        this.currentSource.physicalDevice.instanceID,
        0x01,
        0x11
      ]
      const data408 = [
        0x00,
        0x02,
        this.currentSource.shadowDevice.fBlockID,
        this.currentSource.shadowDevice.instanceID,
        0x01,
        0x11
      ]
      this.currentSource.stopSource()
      this.currentSource = null
      // console.log('starting 406')
      // await this.sendMethod(this.physicalMessage(OpType.startResultAck, 0x406, data406))
      // console.log('406 complete')
      // await this.sendMethod(this.physicalMessage(OpType.startResultAck, 0x408, data408))
      // console.log('408 complete')
    }
    // this.currentSource = null
  }
}

export class Amplifier extends FBlock {
  status: Object
  constructor(
    subscriptions: number[],
    socketmost: SocketMostUsb,
    autoSubscribe: boolean,
    socket: Socket
  ) {
    super(subscriptions, amplifier, amplifierShadow, socketmost, autoSubscribe, socket)
    this.status = {
      0xda1: [],
      0xda0: []
    }
  }

  0xda1(message) {
    this.logger.debug(
      `sending 0xda1 ${this.convertMessageToHex(
        this.createResponseMessage(message, this.status[0xda1], OpType.status)
      )}`
    )
    this.createResponseMessage(message, this.status[0xda1], OpType.status)
  }

  0xda0(message) {
    this.createResponseMessage(message, this.status[0xda0], OpType.status)
  }

  allocate(message: MostRxMessage): void {}

  deallocate(message: MostRxMessage): void {}

  parseMessage(message: MostRxMessage): void {}

  parseShadowMessage(message: MostRxMessage): void {}

  startSource(): void {}

  stopSource(): void {}
}

export class NetworkMaster extends FBlock {
  status: Object
  constructor(
    subscriptions: number[],
    socketmost: SocketMostUsb,
    autoSubscribe: boolean,
    socket: Socket,
    subscribeList: Device[]
  ) {
    super(subscriptions, amplifier, amplifierShadow, socketmost, autoSubscribe, socket)
    this.status = {
      networkMap: {},
      networkStatus: NetworkStatus.notOk
    }
  }

  0xa00(message) {
    switch (message.opType) {
      case OpType.status:
        for (let i = 1; i < message.telLen; i += 2) {
          let readable = FBlockMap[message.data[i]]
          if (readable in this.status['networkMap']) {
            if (!(message.data[i + 1] in this.status['networkMap'][readable]['devices'])) {
              this.status['networkMap'][readable]['devices'].push(
                '0x' + message.data[i + 1].toString(16)
              )
            }
          } else {
            this.status['networkMap'][readable] = {
              fBlockID: message.data[i],
              devices: ['0x' + message.data[i + 1].toString(16)]
            }
          }
        }
        break
    }
    this.logger.debug(`Network updated ${JSON.stringify(this.status['networkMap'])}`)
  }

  allocate(message: MostRxMessage): void {}

  deallocate(message: MostRxMessage): void {}

  parseMessage(message: MostRxMessage): void {}

  parseShadowMessage(message: MostRxMessage): void {}

  startSource(): void {}

  stopSource(): void {}
}
