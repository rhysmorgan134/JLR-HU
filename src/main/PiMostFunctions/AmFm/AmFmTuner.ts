import { SocketMostSendMessage } from 'socketmost/dist/src/modules/Messages'

import { RadioText } from './RadioText'
import { FBlock } from '../Common/FBlock'
import { RadioPreset } from './RadioPreset'
import { RadioPresetList } from './RadioPresetList'
import { RadioFreq } from './RadioFreq'
import { RadioSetPreset } from './RadioSetPreset'
import { RadioSetPreset2 } from './RadioSetPreset2'
import { RadioAutoStore } from './RadioAutoStore'
import { RadioSeek } from './RadioSeek'

export class AmFmTuner extends FBlock {
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
    this.fBlockID = 0x40
    this.writeMessage = writeMessage
    this.instanceID = instanceID
    this.sourceAddrHigh = sourceAddrHigh
    this.sourceAddrLow = sourceAddrLow
    this.status = {}
    this.functions = {
      ...this.functions,
      ...{
        0xd0c: new RadioText(0xd0c, this.sendMessage, this.updateStatus),
        0xd11: new RadioPreset(0xd11, this.sendMessage, this.updateStatus),
        0xd50: new RadioPresetList(0xd50, this.sendMessage, this.updateStatus),
        0xd01: new RadioFreq(0xd01, this.sendMessage, this.updateStatus),
        0xd10: new RadioSetPreset(0xd10, this.sendMessage, this.updateStatus),
        0xd00: new RadioSetPreset2(0xd00, this.sendMessage, this.updateStatus),
        0xd13: new RadioAutoStore(0xd13, this.sendMessage, this.updateStatus),
        0xd03: new RadioSeek(0xd03, this.sendMessage, this.updateStatus)
      }
    }
  }
}
