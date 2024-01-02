import { FBlock } from '../Common/FBlock'
import { NextTrack } from './NextTrack'
import { AudioDiskInfo } from './AudioDiskInfo'
import { TimePosition } from './TimePosition'
import { DeckStatus } from './DeckStatus'
import { TrackPosition } from './TrackPosition'
import { ActiveDisk } from './ActiveDisk'
import { MediaInfo } from './MediaInfo'
import { RandomCd } from './RandomCd'
import { Repeat } from './Repeat'
import { messages } from 'socketmost'

// JLR CD Player - 0x000, 0x001, 0x002, 0x090, 0x091, 0x092, 0x101, 0x102, 0x200
// 0x201, 0x202, 0x412, 0x413, 0x420, 0x420, 0x431, 0x451, 0x452, 0xc11, 0xc12
// 0xc13, 0xc14, 0xc20, 0xc21, 0xc31, 0xc33, 0xc34
// 430 431 451 452

export class AudioDiskPlayer extends FBlock {
  constructor(
    instanceID: number,
    writeMessage: (message: messages.SocketMostSendMessage) => void,
    sourceAddrHigh: number,
    sourceAddrLow: number,
    addressHigh: number,
    addressLow: number
  ) {
    super(0x31, instanceID, writeMessage, sourceAddrHigh, sourceAddrLow, addressHigh, addressLow)
    this.registerFunction(0x200, DeckStatus)
    this.registerFunction(0x0201, TimePosition)
    this.registerFunction(0x202, TrackPosition)
    this.registerFunction(0x412, ActiveDisk)
    this.registerFunction(0x413, MediaInfo)
    this.registerFunction(0x420, AudioDiskInfo)
    this.registerFunction(0x450, RandomCd)
    this.registerFunction(0x452, Repeat)
    this.registerFunction(0xc34, NextTrack)
  }
}
