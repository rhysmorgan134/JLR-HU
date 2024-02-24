import { messages, SocketMostClient } from 'socketmost'
import { Os8104Events, SocketMostSendMessage } from 'socketmost/dist/modules/Messages'
import { sourceMap, SourceRecord } from '../../Globals'
import EventEmitter from 'events'

export class Switching extends EventEmitter {
  socketMostClient: SocketMostClient
  active: boolean
  currentsource: SourceRecord
  x407Recv: boolean
  x405Recv: boolean
  x406Recv: boolean
  x408Recv: boolean
  nextSource?: SourceRecord
  waitingF5: boolean
  sourceMap: Record<number, SourceRecord>
  waitF409: boolean
  sequence: number

  constructor(socketMostClient: SocketMostClient) {
    super()
    this.socketMostClient = socketMostClient
    this.active = false
    this.x408Recv = false
    this.x406Recv = false
    this.x405Recv = false
    this.x407Recv = false
    this.waitingF5 = false
    this.sequence = 0
    this.sourceMap = sourceMap
    this.currentsource = this.sourceMap['auxIn']
    this.socketMostClient.on(
      Os8104Events.SocketMostMessageRxEvent,
      (message: messages.MostRxMessage) => {
        if (this.active) {
          this.parseMessage(message)
        }
        if (message.fBlockID === 0x10 && message.fktID === 0xc01) {
          this.parseSource(message)
        }
      }
    )
    this.on('seqStep', (seq) => {
      switch (seq) {
        case 1:
          // First Message
          this.send405()
          break
        case 2:
          this.send408()
          break
        case 3:
          break
        case 4:
          this.send406()
          break
        case 5:
          this.send407()
          break
        case 6:
          this.beginAudio()
          break
      }
    })
  }

  parseMessage(data: messages.MostRxMessage): void {
    if (data.opType === 0x0a) {
      console.log('processAck: ', data)
    } else if (data.opType === 0x0d) {
      console.log('resultAck: ', data)
    }
    //console.log(data)
    switch (this.sequence) {
      case 1:
        console.log('waiting 405 ack')
        if (data.fktID === 0x405 && data.opType === 0x0d) {
          this.setSeq(2)
        }
        break
      case 2:
        console.log('waiting 408 ack')
        if (data.fktID === 0x408 && data.opType === 0x0d) {
          this.setSeq(4)
        }
        break
      case 3:
        console.log('waiting 409 status')
        if (data.fktID === 0x409 && data.telID === 0x03) {
          this.setSeq(4)
        }
        break
      case 4:
        console.log('waiting Amp Status')
        setTimeout(() => {
          this.setSeq(5)
        }, 300)
        // if (data.fktID === 0xe20 && data.opType === 0x0c) {
        //   this.setSeq(5)
        // }
        break
      case 5:
        if (data.fktID === 0x407 && data.opType === 0x0d) {
          this.setSeq(6)
        }
    }
  }

  parseSource(data) {
    //console.log(data)
    if (data.data.data[0]) {
      //this.currentsource = this.sourceMap[data.data.data[0]]
      console.log('currentSource is: ', this.currentsource)
    }
  }

  async parseAux(data: messages.MostRxMessage): Promise<void> {
    console.log('amp message', data)
    switch (data.fktID) {
      case 0xc80:
        if (data.opType === 0x06) {
          console.log('request to start 0xc80')
          this.send0xc80Resp(
            0xa,
            [0x00, 0x01],
            data.fBlockID,
            data.instanceID,
            data.sourceAddrHigh,
            data.sourceAddrLow
          )
          setTimeout(async () => {
            console.log('sending complete')
            await this.send0xc80Resp(
              0xd,
              [0x00, 0x01],
              data.fBlockID,
              data.instanceID,
              data.sourceAddrHigh,
              data.sourceAddrLow
            )
            console.log('now sending 0x406')
            //this seems to be the proper connect, it triggers the alloc/dealloc
            // const message2: messages.SocketMostSendMessage = {
            //   data: [
            //     0x00,
            //     0x02,
            //     this.currentsource.fBlockID,
            //     this.currentsource.shadow,
            //     0x1,
            //     0x1,
            //     0x01,
            //     this.currentsource.fBlockID,
            //     this.currentsource.instanceID,
            //     0x01,
            //     0x11
            //   ],
            //   fBlockID: 0xf0,
            //   fktID: 0x406,
            //   instanceID: 0x01,
            //   opType: 0x06,
            //   targetAddressHigh: 0x01,
            //   targetAddressLow: 0x61
            // }
            //await this.asyncSend(message2)
          }, 100)
        }
    }
  }

  async send0xc80Resp(
    opType: number,
    data: number[],
    fBlockID: number,
    instanceID: number,
    targetAddressHigh: number,
    targetAddressLow: number
  ) {
    console.log('sending processing Ack for 0xc80')
    let messageOut: messages.SocketMostSendMessage = {
      data: data,
      fBlockID: fBlockID,
      fktID: 0xc80,
      instanceID: instanceID,
      opType: opType,
      targetAddressHigh: targetAddressHigh,
      targetAddressLow: targetAddressLow
    }
    await this.asyncSend(messageOut)
  }

  async asyncSend(message: SocketMostSendMessage) {
    return new Promise((resolve) => {
      //console.log('sending: ', message)
      this.socketMostClient.sendControlMessage(message)
      this.socketMostClient.once(Os8104Events.MessageSent, () => {
        resolve(true)
      })
    })
  }

  async switchSource(source: number) {
    this.stopAudio()
    this.nextSource = this.sourceMap[source]
    this.setSeq(1)
    this.active = true

    // this appears to be a disconnect message, happens straight after the above
  }

  setSeq(seq: number) {
    this.sequence = seq
    this.emit('seqStep', this.sequence)
  }

  async send405() {
    console.log('sending 405')
    const message: messages.SocketMostSendMessage = {
      data: [
        0x00,
        0x01,
        this.nextSource!.fBlockID,
        this.nextSource!.shadow,
        0x1,
        0x1,
        this.nextSource!.fBlockID,
        this.nextSource!.instanceID,
        0x1,
        0x11
      ],
      fBlockID: 0xf0,
      fktID: 0x405,
      instanceID: 0x01,
      opType: 0x06,
      targetAddressHigh: 0x01,
      targetAddressLow: 0x61
    }
    await this.asyncSend(message)
  }

  async send408() {
    console.log('sending 408')
    const message2: messages.SocketMostSendMessage = {
      data: [0x00, 0x02, this.currentsource.fBlockID, this.currentsource.shadow, 0x1, 0x11],
      fBlockID: 0xf0,
      fktID: 0x408,
      instanceID: 0x01,
      opType: 0x06,
      targetAddressHigh: 0x01,
      targetAddressLow: 0x61
    }
    await this.asyncSend(message2)
  }

  async send406() {
    console.log('SENDING 406')
    const message3: messages.SocketMostSendMessage = {
      data: [
        0x00,
        0x02,
        this.currentsource.fBlockID,
        this.currentsource.shadow,
        0x1,
        0x1,
        0x01,
        this.currentsource.fBlockID,
        this.currentsource.instanceID,
        0x01,
        0x11
      ],
      fBlockID: 0xf0,
      fktID: 0x406,
      instanceID: 0x01,
      opType: 0x06,
      targetAddressHigh: 0x01,
      targetAddressLow: 0x61
    }
    this.asyncSend(message3)
  }

  async send407() {
    let message: SocketMostSendMessage = {
      data: [0x0, 0x01, this.nextSource!.fBlockID, this.nextSource!.shadow, 0x1, 0x11],
      fBlockID: 0xf0,
      fktID: 0x407,
      instanceID: 0x01,
      opType: 0x06,
      targetAddressHigh: 0x01,
      targetAddressLow: 0x61
    }
    await this.asyncSend(message)
  }

  stopAudio() {
    switch (this.currentsource.fBlockID) {
      case 0x31:
        this.stopCd()
        break
      case 0x40:
        this.stopRadio()
        break
    }
  }

  async beginAudio() {
    this.currentsource = this.nextSource!
    switch (this.currentsource.fBlockID) {
      case 0x31:
        await this.startCd()
        break
      case 0x40:
        await this.startRadio()
        break
    }
    this.setSeq(0)
  }

  async stopCd() {
    const stopCD: SocketMostSendMessage = {
      data: [0x02],
      fBlockID: this.currentsource.fBlockID,
      fktID: 0x200,
      instanceID: this.currentsource.instanceID,
      opType: 0x0,
      targetAddressHigh: this.currentsource.addressHigh,
      targetAddressLow: this.currentsource.addressLow
    }
    await this.asyncSend(stopCD)
  }

  async stopRadio() {
    const setPreset: SocketMostSendMessage = {
      data: [0x06, 0x01],
      fBlockID: 0x40,
      fktID: 0xd10,
      instanceID: this.currentsource.instanceID,
      opType: 0x2,
      targetAddressHigh: this.currentsource.addressHigh,
      targetAddressLow: this.currentsource.addressLow
    }
    await this.asyncSend(setPreset)
    const startSource: SocketMostSendMessage = {
      data: [0x01, 0x00],
      fBlockID: 0x40,
      fktID: 0x103,
      instanceID: this.currentsource.instanceID,
      opType: 0x2,
      targetAddressHigh: this.currentsource.addressHigh,
      targetAddressLow: this.currentsource.addressLow
    }
    await this.asyncSend(startSource)
  }

  async startCd() {
    const playCD: SocketMostSendMessage = {
      data: [0x00],
      fBlockID: this.currentsource.fBlockID,
      fktID: 0x200,
      instanceID: this.currentsource.instanceID,
      opType: 0x0,
      targetAddressHigh: this.currentsource.addressHigh,
      targetAddressLow: this.currentsource.addressLow
    }
    await this.asyncSend(playCD)
  }

  async startRadio() {
    const startSource: SocketMostSendMessage = {
      data: [0x01, 0x02],
      fBlockID: 0x40,
      fktID: 0x103,
      instanceID: this.currentsource.instanceID,
      opType: 0x2,
      targetAddressHigh: this.currentsource.addressHigh,
      targetAddressLow: this.currentsource.addressLow
    }
    await this.asyncSend(startSource)
    const setPreset: SocketMostSendMessage = {
      data: [0x01, 0x03, 0x06, 0x01],
      fBlockID: 0x40,
      fktID: 0xd00,
      instanceID: this.currentsource.instanceID,
      opType: 0x2,
      targetAddressHigh: this.currentsource.addressHigh,
      targetAddressLow: this.currentsource.addressLow
    }
    await this.asyncSend(setPreset)
  }
}
