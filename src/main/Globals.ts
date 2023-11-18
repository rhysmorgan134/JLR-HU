import { Stream } from "socketmost/dist/modules/Messages";
import { DongleConfig } from 'node-carplay/node'
import { DeckStatus } from "./PiMostFunctions/AudioDiskPlayer/DeckStatus";
import { TimePosition } from "./PiMostFunctions/AudioDiskPlayer/TimePosition";
import { TrackPosition } from "./PiMostFunctions/AudioDiskPlayer/TrackPosition";
import { ActiveDisk } from "./PiMostFunctions/AudioDiskPlayer/ActiveDisk";
import { MediaInfo } from "./PiMostFunctions/AudioDiskPlayer/MediaInfo";
import { AudioDiskInfo } from "./PiMostFunctions/AudioDiskPlayer/AudioDiskInfo";
import { RandomCd } from "./PiMostFunctions/AudioDiskPlayer/RandomCd";
import { NextTrack } from "./PiMostFunctions/AudioDiskPlayer/NextTrack";

export type Most = {
  stream?: Stream
}

export type ExtraConfig = DongleConfig & {
  kiosk: boolean,
  camera: string,
  microphone: string,
  piMost: boolean,
  canbus: boolean,
  bindings: KeyBindings,
  most?: Most,
  canConfig?: CanConfig
}

export interface KeyBindings {
  'left': string,
  'right': string,
  'selectDown': string,
  'back': string,
  'down': string,
  'home': string,
  'play': string,
  'pause': string,
  'next': string,
  'prev': string
}

export interface CanMessage {
  canId: number,
  byte: number,
  mask: number
}

export interface CanConfig {
  reverse?: CanMessage,
  lights?: CanMessage
}

export type Action = {
  fktId: number
  opType: number
  data: number[]
  type: string
  method: 'properties' | 'methods'
}

export interface FktIdPartMessage {
  fktId: number
  opType: number
  data: number[]
}

// 0x200: new DeckStatus(0x200, this.sendMessage.bind(this), this.updateStatus.bind(this)),
//   0x201: new TimePosition(0x0201, this.sendMessage.bind(this), this.updateStatus.bind(this)),
//   0x202: new TrackPosition(0x202, this.sendMessage.bind(this), this.updateStatus.bind(this)),
//   0x412: new ActiveDisk(0x412, this.sendMessage.bind(this), this.updateStatus.bind(this)),
//   0x413: new MediaInfo(0x413, this.sendMessage.bind(this), this.updateStatus.bind(this)),
//   0x420: new AudioDiskInfo(0x420, this.sendMessage.bind(this), this.updateStatus.bind(this)),
//   0x450: new RandomCd(0x450, this.sendMessage.bind(this), this.updateStatus.bind(this)),
//   0xc34: new NextTrack(0xc34, this.sendMessage.bind(this), this.updateStatus.bind(this)),

export interface AudioDiskPlayerActions  {
  fBlock: 'AudioDiskPlayer',
  action: ''
}

export interface Subscriptions {

}
