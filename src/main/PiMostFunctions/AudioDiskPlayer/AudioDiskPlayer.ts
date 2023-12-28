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
import { SocketMostSendMessage } from 'socketmost/dist/src/modules/Messages'

// JLR CD Player - 0x000, 0x001, 0x002, 0x090, 0x091, 0x092, 0x101, 0x102, 0x200
// 0x201, 0x202, 0x412, 0x413, 0x420, 0x420, 0x431, 0x451, 0x452, 0xc11, 0xc12
// 0xc13, 0xc14, 0xc20, 0xc21, 0xc31, 0xc33, 0xc34
// 430 431 451 452

export class AudioDiskPlayer extends FBlock {
  fBlockID: number
  writeMessage: (message: SocketMostSendMessage) => void
  instanceID: number
  sourceAddrLow: number
  sourceAddrHigh: number

  constructor(
    instanceID: number,
    writeMessage: (message: SocketMostSendMessage) => void,
    sourceAddrHigh: number,
    sourceAddrLow: number,
    addressHigh: number,
    addressLow: number
  ) {
    super(instanceID, writeMessage, sourceAddrHigh, sourceAddrLow, addressHigh, addressLow)
    this.fBlockID = 0x31
    this.writeMessage = writeMessage
    this.instanceID = instanceID
    this.sourceAddrHigh = sourceAddrHigh
    this.sourceAddrLow = sourceAddrLow
    this.status = {}
    this.functions = {
      ...this.functions,
      ...{
        0x200: new DeckStatus(0x200, this.sendMessage, this.updateStatus),
        0x201: new TimePosition(0x0201, this.sendMessage, this.updateStatus),
        0x202: new TrackPosition(0x202, this.sendMessage, this.updateStatus),
        0x412: new ActiveDisk(0x412, this.sendMessage, this.updateStatus),
        0x413: new MediaInfo(0x413, this.sendMessage, this.updateStatus),
        0x420: new AudioDiskInfo(0x420, this.sendMessage, this.updateStatus),
        0x450: new RandomCd(0x450, this.sendMessage, this.updateStatus),
        0x452: new Repeat(0x452, this.sendMessage, this.updateStatus),
        0xc34: new NextTrack(0xc34, this.sendMessage, this.updateStatus)
      }
    }
  }
}
