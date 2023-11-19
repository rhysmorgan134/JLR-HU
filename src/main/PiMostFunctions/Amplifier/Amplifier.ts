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
import { SocketMostSendMessage } from 'socketmost/dist/modules/Messages'
import { Connect } from "../Common/Connect";

export class Amplifier extends FBlock {
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
    this.fBlockID = 0x22
    this.writeMessage = writeMessage
    this.instanceID = instanceID
    this.sourceAddrHigh = sourceAddrHigh
    this.sourceAddrLow = sourceAddrLow
    this.status = {}
    this.functions = {
      ...this.functions,
      ...{
        0x467: new MixerLevel(0x467, this.sendMessage.bind(this), this.updateStatus.bind(this)),
        0x400: new Volume(0x400, this.sendMessage.bind(this), this.updateStatus.bind(this)),
        0x112: new Disconnect(0x112, this.sendMessage.bind(this), this.updateStatus.bind(this)),
        0x111: new Connect(0x111, this.sendMessage.bind(this), this.updateStatus.bind(this)),
        0x200: new Balance(0x200, this.sendMessage.bind(this), this.updateStatus.bind(this)),
        0x201: new Loudness(0x201, this.sendMessage.bind(this), this.updateStatus.bind(this)),
        0x202: new Bass(0x202, this.sendMessage.bind(this), this.updateStatus.bind(this)),
        0x203: new Treble(0x203, this.sendMessage.bind(this), this.updateStatus.bind(this)),
        0x204: new Fader(0x204, this.sendMessage.bind(this), this.updateStatus.bind(this)),
        0x402: new Subwoofer(0x402, this.sendMessage.bind(this), this.updateStatus.bind(this)),
        0xe22: new CustAudio(0xe22, this.sendMessage.bind(this), this.updateStatus.bind(this)),
        0xe21: new CustSurround(0xe21, this.sendMessage.bind(this), this.updateStatus.bind(this)),
        0xe20: new CustSpeakers(0xe20, this.sendMessage.bind(this), this.updateStatus.bind(this)),
        0xe09: new Source(0xe09, this.sendMessage.bind(this), this.updateStatus.bind(this))
      }
    }
  }

  // sendMessage({fktID, opType, data}) {
  //     this.writeMessage({fBlockID: this.fBlockID, instanceID: this.instID, fktID, opType, data}, {sourceAddrHigh: this.sourceAddrHigh, sourceAddrLow: this.sourceAddrLow})
  // }
}
