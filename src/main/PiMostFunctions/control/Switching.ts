import { messages, SocketMostClient } from 'socketmost'
import { Os8104Events, SocketMostSendMessage } from 'socketmost/dist/modules/Messages'

export class Switching {
  socketMostClient: SocketMostClient
  active: boolean
  constructor(socketMostClient: SocketMostClient) {
    this.socketMostClient = socketMostClient
    this.active = false
    this.socketMostClient.on(
      Os8104Events.SocketMostMessageRxEvent,
      (message: messages.MostRxMessage) => {
        if (this.active) {
          this.parseMessage(message)
        }
      }
    )
  }

  parseMessage(data: messages.MostRxMessage): void {
    if (data.opType === 0x0a) {
      console.log('processAck: ', data)
    } else if (data.opType === 0x0d) {
      console.log('resultAck: ', data)
    }
    switch (data.fBlockID) {
      case 0x24:
        this.parseAux(data)
        break
      case 0x22:
        this.parseAmp(data)
        break
      case 0xf0:
        this.parseGateway(data)
        break
    }
  }

  async parseAux(data: messages.MostRxMessage): Promise<void> {
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
            // this seems to be the proper connect, it triggers the alloc/dealloc
            const message2: messages.SocketMostSendMessage = {
              data: [0x00, 0x02, 0x24, 0xa1, 0x1, 0x1, 0x01, 0x24, 0x01, 0x01, 0x11],
              fBlockID: 0xf0,
              fktID: 0x406,
              instanceID: 0x01,
              opType: 0x06,
              targetAddressHigh: 0x01,
              targetAddressLow: 0x61
            }
            await this.asyncSend(message2)
          })
        }
    }
  }

  async parseAmp(data: messages.MostRxMessage): Promise<void> {
    switch (data.fktID) {
      case 0xe22:
        console.log('received amplifier status: ', data)
    }
  }

  async parseGateway(data: messages.MostRxMessage): Promise<void> {
    if (data.opType === 0x0c && data.fktID === 0x409) {
      if (data.data[0] === 0 && data.opType === 0x0c) {
        let message: SocketMostSendMessage = {
          data: [0x0, 0x01, 0x31, 0xa1, 0x1, 0x11],
          fBlockID: 0xf0,
          fktID: 0x407,
          instanceID: 0x01,
          opType: 0x06,
          targetAddressHigh: 0x01,
          targetAddressLow: 0x61
        }
        await this.asyncSend(message)
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
      this.socketMostClient.sendControlMessage(message)
      this.socketMostClient.once(Os8104Events.MessageSent, () => {
        resolve(true)
      })
    })
  }

  async switchToCd() {
    // this appears to be a prepare to connect, points to audioDiskPlayer both physical and shadow
    this.active = true
    const message: messages.SocketMostSendMessage = {
      data: [0x00, 0x01, 0x31, 0xa1, 0x1, 0x1, 0x31, 0x2, 0x1, 0x11],
      fBlockID: 0xf0,
      fktID: 0x405,
      instanceID: 0x01,
      opType: 0x06,
      targetAddressHigh: 0x01,
      targetAddressLow: 0x61
    }
    await this.asyncSend(message)
    // this appears to be a disconnect message, happens straight after the above
    const message2: messages.SocketMostSendMessage = {
      data: [0x00, 0x02, 0x24, 0xa1, 0x1, 0x11],
      fBlockID: 0xf0,
      fktID: 0x408,
      instanceID: 0x01,
      opType: 0x06,
      targetAddressHigh: 0x01,
      targetAddressLow: 0x61
    }
    await this.asyncSend(message2)
  }
}
