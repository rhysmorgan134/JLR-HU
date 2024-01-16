import { MixerLevel } from '../AudioDiskPlayer/MixerLevel'
import { Volume } from '../JlrAudio/Volume'
import { Balance } from './Balance'
import { Fader } from './Fader'
import { Bass } from './Bass'
import { Treble } from './Treble'
import { Subwoofer } from './Subwoofer'
import { Loudness } from './Loudness'
import { CustAudio } from './CustAudio'
import { CustSpeakers } from './CustSpeakers'
import { CustSurround } from './CustSurround'
import { FBlock } from '../Common/FBlock'
import { Disconnect } from '../Common/Disconnect'
import { Source } from './Source'
import { messages } from 'socketmost'
import { Connect } from '../Common/Connect'

export class Amplifier extends FBlock {
  constructor(
    instanceID: number,
    writeMessage: (message: messages.SocketMostSendMessage) => void,
    sourceAddrHigh: number,
    sourceAddrLow: number,
    addressHigh: number,
    addressLow: number
  ) {
    super(0x22, instanceID, writeMessage, sourceAddrHigh, sourceAddrLow, addressHigh, addressLow)
    this.registerFunction(0x467, MixerLevel)
    this.registerFunction(0x400, Volume)
    this.registerFunction(0x112, Disconnect)
    this.registerFunction(0x111, Connect)
    this.registerFunction(0x200, Balance)
    this.registerFunction(0x201, Loudness)
    this.registerFunction(0x202, Bass)
    this.registerFunction(0x203, Treble)
    this.registerFunction(0x204, Fader)
    this.registerFunction(0x402, Subwoofer)
    this.registerFunction(0xe22, CustAudio)
    this.registerFunction(0xe21, CustSurround)
    this.registerFunction(0xe20, CustSpeakers)
    this.registerFunction(0xe09, Source)
  }

  // sendMessage({fktID, opType, data}) {
  //     this.writeMessage({fBlockID: this.fBlockID, instanceID: this.instID, fktID, opType, data}, {sourceAddrHigh: this.sourceAddrHigh, sourceAddrLow: this.sourceAddrLow})
  // }
}
