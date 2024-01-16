import { messages } from 'socketmost'

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
  constructor(
    instanceID: number,
    writeMessage: (message: messages.SocketMostSendMessage) => void,
    sourceAddrHigh: number,
    sourceAddrLow: number,
    addressHigh: number,
    addressLow: number
  ) {
    super(0x40, instanceID, writeMessage, sourceAddrHigh, sourceAddrLow, addressHigh, addressLow)
    this.registerFunction(0xd0c, RadioText)
    this.registerFunction(0xd11, RadioPreset)
    this.registerFunction(0xd50, RadioPresetList)
    this.registerFunction(0xd01, RadioFreq)
    this.registerFunction(0xd10, RadioSetPreset)
    this.registerFunction(0xd00, RadioSetPreset2)
    this.registerFunction(0xd13, RadioAutoStore)
    this.registerFunction(0xd03, RadioSeek)
  }
}
