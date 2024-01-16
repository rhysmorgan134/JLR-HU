import { FBlock } from '../Common/FBlock'
import { messages } from 'socketmost'
import { Temps } from './Temps'
import { FanSpeed } from './FanSpeed'
import { ClimateStatus } from './ClimateStatus'

// JLR CD Player - 0x000, 0x001, 0x002, 0x090, 0x091, 0x092, 0x101, 0x102, 0x200
// 0x201, 0x202, 0x412, 0x413, 0x420, 0x420, 0x431, 0x451, 0x452, 0xc11, 0xc12
// 0xc13, 0xc14, 0xc20, 0xc21, 0xc31, 0xc33, 0xc34
// 430 431 451 452

export class Climate extends FBlock {
  constructor(
    instanceID: number,
    writeMessage: (message: messages.SocketMostSendMessage) => void,
    sourceAddrHigh: number,
    sourceAddrLow: number,
    addressHigh: number,
    addressLow: number
  ) {
    super(0x71, instanceID, writeMessage, sourceAddrHigh, sourceAddrLow, addressHigh, addressLow)
    this.registerFunction(0xc85, FanSpeed)
    this.registerFunction(0xc87, Temps)
    this.registerFunction(0xc88, ClimateStatus)
  }
}
