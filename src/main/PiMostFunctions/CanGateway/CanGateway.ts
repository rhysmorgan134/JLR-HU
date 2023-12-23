import { FBlock } from '../Common/FBlock'
import { SocketMostSendMessage } from 'socketmost/dist/modules/Messages'
import { FrontSensors } from './FrontSensors'
import { RearSensors } from './RearSensors'
import { Lights } from './Lights'
import { ExternalTemp } from './ExternalTemp'
import { TripData } from './TripData'

// JLR CD Player - 0x000, 0x001, 0x002, 0x090, 0x091, 0x092, 0x101, 0x102, 0x200
// 0x201, 0x202, 0x412, 0x413, 0x420, 0x420, 0x431, 0x451, 0x452, 0xc11, 0xc12
// 0xc13, 0xc14, 0xc20, 0xc21, 0xc31, 0xc33, 0xc34
// 430 431 451 452

export class CanGateway extends FBlock {
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
    this.fBlockID = 0xf5
    this.writeMessage = writeMessage
    this.instanceID = instanceID
    this.sourceAddrHigh = sourceAddrHigh
    this.sourceAddrLow = sourceAddrLow
    this.status = {}
    this.functions = {
      ...this.functions,
      ...{
        0xe1a: new FrontSensors(0xe1a, this.sendMessage.bind(this), this.updateStatus.bind(this)),
        0xe1b: new RearSensors(0xe1b, this.sendMessage.bind(this), this.updateStatus.bind(this)),
        0xe05: new Lights(0xe05, this.sendMessage.bind(this), this.updateStatus.bind(this)),
        0xe0f: new ExternalTemp(0xe0f, this.sendMessage.bind(this), this.updateStatus.bind(this)),
        0xe15: new TripData(0xe15, this.sendMessage.bind(this), this.updateStatus.bind(this))
      }
    }
  }
}
