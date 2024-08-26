import { FBlock } from '../Common/FBlock'
import { messages } from 'socketmost'
import { FrontSensors } from './FrontSensors'
import { RearSensors } from './RearSensors'
import { Lights } from './Lights'
import { ExternalTemp } from './ExternalTemp'
import { TripData } from './TripData'
import { DriveAwayLocking } from './DriveAwayLocking'
import { TwoStageLocking } from './TwoStageLocking'
import { PassiveArming } from './PassiveArming'
import { AutoLock } from './AutoLock'
import { MirrorFoldBack } from './MirrorFoldBack'
import { GlobalWindows } from './GlobalWindows'
import { CanGatewayStatus } from './CanGatewayTypes'
import { AlarmSensors } from './AlarmSensors'

// JLR CD Player - 0x000, 0x001, 0x002, 0x090, 0x091, 0x092, 0x101, 0x102, 0x200
// 0x201, 0x202, 0x412, 0x413, 0x420, 0x420, 0x431, 0x451, 0x452, 0xc11, 0xc12
// 0xc13, 0xc14, 0xc20, 0xc21, 0xc31, 0xc33, 0xc34
// 430 431 451 452

export class CanGateway extends FBlock {
  status: Partial<CanGatewayStatus>
  constructor(
    instanceID: number,
    writeMessage: (message: messages.SocketMostSendMessage) => void,
    sourceAddrHigh: number,
    sourceAddrLow: number,
    addressHigh: number,
    addressLow: number
  ) {
    super(0xf5, instanceID, writeMessage, sourceAddrHigh, sourceAddrLow, addressHigh, addressLow)
    this.status = {}
    this.registerFunction(0xe05, Lights)
    this.registerFunction(0xe09, AlarmSensors)
    this.registerFunction(0xe0a, TwoStageLocking)
    this.registerFunction(0xe0f, ExternalTemp)
    this.registerFunction(0xe15, TripData)
    this.registerFunction(0xe17, MirrorFoldBack)
    this.registerFunction(0xe1a, FrontSensors)
    this.registerFunction(0xe1b, RearSensors)
    this.registerFunction(0xe21, GlobalWindows)
    this.registerFunction(0xe27, DriveAwayLocking)
    this.registerFunction(0xe29, PassiveArming)
    this.registerFunction(0xe2a, AutoLock)
  }
}
