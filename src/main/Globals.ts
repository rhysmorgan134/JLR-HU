import { Stream } from 'socketmost/dist/src/modules/Messages'
import { DongleConfig } from 'node-carplay/node'

export type Most = {
  stream?: Stream
}

export type ExtraConfig = DongleConfig & {
  kiosk: boolean
  camera: string
  microphone: string
  piMost: boolean
  canbus: boolean
  bindings: KeyBindings
  most?: Most
  canConfig?: CanConfig
}

export interface KeyBindings {
  left: string
  right: string
  selectDown: string
  back: string
  down: string
  home: string
  play: string
  pause: string
  next: string
  prev: string
}

export interface CanMessage {
  canId: number
  byte: number
  mask: number
}

export interface CanConfig {
  reverse?: CanMessage
  lights?: CanMessage
}

export type Action = {
  fktID: number
  opType: number
  data: number[]
  type: string
  method: 'properties' | 'methods'
}

export interface FktIdPartMessage {
  fktID: number
  opType: number
  data: number[]
}

// 0x200: new DeckStatus(0x200, this.sendMessage, this.updateStatus),
//   0x201: new TimePosition(0x0201, this.sendMessage, this.updateStatus),
//   0x202: new TrackPosition(0x202, this.sendMessage, this.updateStatus),
//   0x412: new ActiveDisk(0x412, this.sendMessage, this.updateStatus),
//   0x413: new MediaInfo(0x413, this.sendMessage, this.updateStatus),
//   0x420: new AudioDiskInfo(0x420, this.sendMessage, this.updateStatus),
//   0x450: new RandomCd(0x450, this.sendMessage, this.updateStatus),
//   0xc34: new NextTrack(0xc34, this.sendMessage, this.updateStatus),

export interface AudioDiskPlayerActions {
  fBlock: 'AudioDiskPlayer'
  action: ''
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Subscriptions {}

export type AvailableSources = 'AudioDiskPlayer' | 'AmFmTuner'
