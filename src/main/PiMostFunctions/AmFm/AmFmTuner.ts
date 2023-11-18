import { SocketMostSendMessage } from "socketmost/dist/modules/Messages";

import { RadioText } from './RadioText'
import { FBlock } from'../Common/FBlock'
import { RadioPreset } from './RadioPreset'
import { RadioPresetList } from'./RadioPresetList'
import { RadioFreq } from'./RadioFreq'
import { RadioSetPreset } from'./RadioSetPreset'
import { RadioSetPreset2 } from'./RadioSetPreset2'
import { RadioAutoStore } from'./RadioAutoStore'
import { RadioSeek } from'./RadioSeek'

export class AmFmTuner extends FBlock{
  fBlockID: number
  writeMessage: (message: SocketMostSendMessage) => void
  instanceID: number
  sourceAddrLow: number
  sourceAddrHigh: number

  constructor(
    instanceID: number,
    writeMessage: () => void,
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
        this.functions = {...this.functions, ...{
                0xD0C: new RadioText(0xD0C, this.sendMessage.bind(this), this.updateStatus.bind(this)),
                0xD11: new RadioPreset(0xD11, this.sendMessage.bind(this), this.updateStatus.bind(this)),
                0xD50: new RadioPresetList(0xD50, this.sendMessage.bind(this), this.updateStatus.bind(this)),
                0xD01: new RadioFreq(0xD01, this.sendMessage.bind(this), this.updateStatus.bind(this)),
                0xD10: new RadioSetPreset(0xD10, this.sendMessage.bind(this), this.updateStatus.bind(this)),
                0xD00: new RadioSetPreset2(0xD00, this.sendMessage.bind(this), this.updateStatus.bind(this)),
                0xD13: new RadioAutoStore(0xD13, this.sendMessage.bind(this), this.updateStatus.bind(this)),
                0xD03: new RadioSeek(0xD03, this.sendMessage.bind(this), this.updateStatus.bind(this))
            }
        }
    }
}
