import { messages, SocketMostClient } from 'socketmost'
import { Os8104Events, SocketMostSendMessage, Stream } from 'socketmost/dist/modules/Messages'
import { sourceMap, SourceRecord } from '../../Globals'
import EventEmitter from 'events'
import winston from 'winston'

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
  sourceName: string
  waitF409: boolean
  sequence: number
  activeChannel: number
  currentChannel: number
  carplayStreaming: boolean
  logger: winston.Logger

  constructor(socketMostClient: SocketMostClient) {
    super()
    this.socketMostClient = socketMostClient
    this.logger = winston.loggers.get('jlrHU')
    this.active = false
    this.x408Recv = false
    this.x406Recv = false
    this.x405Recv = false
    this.x407Recv = false
    this.waitingF5 = false
    this.sequence = 0
    this.sourceMap = sourceMap
    this.sourceName = ''
    this.currentsource = this.sourceMap['auxIn']
    this.activeChannel = 0x00
    this.currentChannel = 0x02
    this.carplayStreaming = false
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
          this.logger.info('sending 405')
          this.send405()
          break
        case 2:
          this.logger.info('sending 408')
          this.send408()
          break
        case 3:
          break
        case 4:
          this.logger.info('sending 406')
          this.send406()
          break
        case 5:
          this.logger.info('sending 407')
          this.send407()
          break
        case 6:
          this.logger.info('beginning audio')
          this.beginAudio()
          break
      }
    })
  }

  parseMessage(data: messages.MostRxMessage): void {
    if (data.opType === 0x0a) {
    } else if (data.opType === 0x0d) {
    }
    if (data.fBlockID === 0x22 && data.fktID === 0xe22 && data.data[0] !== 0x00) {
      this.currentChannel = data.data[0]
    }
    switch (this.sequence) {
      case 1:
        if (data.fktID === 0x405 && data.opType === 0x0d) {
          this.logger.info('405 ack')
          this.setSeq(2)
        }
        break
      case 2:
        if (data.fktID === 0x408 && data.opType === 0x0d) {
          this.logger.info('408 ack')
          this.setSeq(4)
        }
        break
      case 3:
        if (data.fktID === 0x409 && data.telID === 0x03) {
          this.logger.info('409 finished')
          this.setSeq(4)
        } else if (data.fktID === 409 && data.telID === 0x01) {
          this.activeChannel = data.data[3] - 4
          this.logger.info(`testing - ${this.activeChannel}`)
        }
        break
      case 4:
        setTimeout(() => {
          this.setSeq(5)
        }, 300)
        // if (data.fktID === 0xe20 && data.opType === 0x0c) {
        //   this.setSeq(5)
        // }
        break
      case 5:
        if (data.fktID === 0x407 && data.opType === 0x0d) {
          this.logger.info('407 ack')
          this.setSeq(6)
        }
    }
  }

  parseSource(data) {}

  async parseAux(data: messages.MostRxMessage): Promise<void> {
    switch (data.fktID) {
      case 0xc80:
        if (data.opType === 0x06) {
          this.send0xc80Resp(
            0xa,
            [0x00, 0x01],
            data.fBlockID,
            data.instanceID,
            data.sourceAddrHigh,
            data.sourceAddrLow
          )
          setTimeout(async () => {
            await this.send0xc80Resp(
              0xd,
              [0x00, 0x01],
              data.fBlockID,
              data.instanceID,
              data.sourceAddrHigh,
              data.sourceAddrLow
            )
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
      this.socketMostClient.sendControlMessage(message)
      this.socketMostClient.once(Os8104Events.MessageSent, () => {
        resolve(true)
      })
    })
  }

  async switchSource(source: number) {
    if (this.sourceMap[source].name !== this.sourceName) {
      this.stopAudio()
      this.nextSource = this.sourceMap[source]
      this.logger.info(`switching to source: ${JSON.stringify(this.nextSource)}`)
      this.setSeq(1)
      this.active = true
    }
    this.logger.info('No switch needed already on correct source')
  }

  async switchToCarplay() {
    if (this.sourceName != 'carplay') {
      this.logger.info('switching to carplay')
      this.stopAudio()
      this.nextSource = this.sourceMap['auxIn']
      this.setSeq(1)
      this.active = true
      setTimeout(() => {
        const data: Stream = {
          fBlockID: 0x22,
          instanceID: 0x05,
          sinkNr: 0x01,
          sourceAddrHigh: 0x01,
          sourceAddrLow: 0x86
        }
        this.logger.info('streaming pimost')
        this.socketMostClient.stream(data)
        this.sourceName = 'carplay'
        this.carplayStreaming = true
      }, 300)
    }
  }

  setSeq(seq: number) {
    this.sequence = seq
    this.emit('seqStep', this.sequence)
  }

  async send405() {
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

  async stopAudio() {
    if (this.carplayStreaming) {
      this.logger.info('stopping carplay')
      await this.stopCarplay()
    }
    switch (this.currentsource.fBlockID) {
      case 0x31:
        this.stopCd()
        break
      case 0x40:
        this.stopRadio()
        break
    }
  }

  async stopCarplay() {
    const disconnect: SocketMostSendMessage = {
      data: [0x01],
      fBlockID: 0x22,
      fktID: 0x112,
      instanceID: 0x05,
      opType: 0x02,
      targetAddressHigh: 0x01,
      targetAddressLow: 0x86
    }
    await this.asyncSend(disconnect)
    await this.deallocate()
    return new Promise(async (resolve, reject) => {
      setTimeout(async () => {
        const connect: SocketMostSendMessage = {
          data: [0x01, 0x03, 0x02, 0x03, 0x04, 0x05],
          fBlockID: 0x22,
          fktID: 0x112,
          instanceID: 0x05,
          opType: 0x02,
          targetAddressHigh: 0x01,
          targetAddressLow: 0x86
        }
        await this.asyncSend(connect)
        resolve(1)
      }, 50)
    })
  }

  deallocate() {
    return new Promise((resolve, reject) => {
      this.logger.info('deallocating')
      this.socketMostClient.deallocate()
      const deallocateTimeout = setTimeout(() => {
        reject()
      }, 300)
      this.socketMostClient.once(Os8104Events.DeallocResult, () => {
        clearTimeout(deallocateTimeout)
        resolve(1)
      })
    })
  }

  async beginAudio() {
    this.currentsource = this.nextSource!
    this.sourceName = this.nextSource.name
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
