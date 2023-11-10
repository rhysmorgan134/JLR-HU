import { FktIdPartMessage } from "../../Globals";

export abstract class Fkt {
  writeMessage: (message: FktIdPartMessage) => void
  fktId: number
  updateStatus: (result: Object) => void
  responseReceived: boolean
  waiting: boolean
  messageSeq: number
  multipartLength: number
  multipartBuffer: Buffer
  actionOpType: Record<string, ((data: number[])=> Promise<void>) | (()=> void)>
  constructor(fktId: number, writeMessage: (message: FktIdPartMessage) => void, updateStatus: (result: Object) => void) {
    this.writeMessage = writeMessage
    this.fktId = fktId
    this.responseReceived = false
    this.waiting = false
    this.messageSeq = 0x00
    this.multipartLength = 0x00
    this.multipartBuffer = Buffer.alloc(65536)
    this.updateStatus = updateStatus
    this.actionOpType = {
      Set: this.set.bind(this),
      Get: this.get.bind(this),
      SetGet: this.setGet.bind(this),
      Increment: this.increment.bind(this),
      Decrement: this.decrement.bind(this),
      GetInterface: this.getInterface.bind(this),
      StartResultAck: this.startResultAck.bind(this),
      Start: this.get.bind(this),
      StartResult: this.startResult.bind(this),
    }
  }

  async get(data: number[] = []) {
    this.responseReceived = false
    this.writeMessage({ fktId: this.fktId, opType: 0x01, data: data })
  }

  async getInterface(data: number[] = []) {
    this.responseReceived = false
    this.writeMessage({ fktId: this.fktId, opType: 0x05, data: data })
  }

  async set(data: number[]) {
    this.responseReceived = false
    this.writeMessage({ fktId: this.fktId, opType: 0x00, data: data })
  }

  async increment(data: number[]) {
    this.responseReceived = false
    this.writeMessage({ fktId: this.fktId, opType: 0x03, data: data })
  }

  async decrement(data: number[]) {
    this.responseReceived = false
    this.writeMessage({ fktId: this.fktId, opType: 0x04, data: data })
  }

  async startResult(data: number[]) {
    this.responseReceived = false
    this.writeMessage({ fktId: this.fktId, opType: 0x02, data: data })
  }

  async startResultAck(data: number[]) {
    this.responseReceived = false
    this.writeMessage({ fktId: this.fktId, opType: 0x06, data: data })
  }

  async setGet(data: number[]) {
    this.responseReceived = false
    this.writeMessage({ fktId: this.fktId, opType: 0x02, data: data })
  }

  abstract status(data: Buffer, telLen: number): void

  async getReq(data: number[] = [], telLen: number, sourceAddrHigh, sourceAddrLow) {}

  async parseStatus({fktID, opType, telID, telLen, data, instanceID}) {
    data = Buffer.from(data)
    let seq = data.readUint8(0)
    switch (telID) {
      case 0:
        await this.status(data, telLen)
        break
      case 1:
        data.copy(this.multipartBuffer, this.multipartLength, 1, data.length)
        this.messageSeq = data.readUint8(0)
        this.multipartLength += telLen - 1
        break
      case 2:
        if (this.multipartLength === 0) {
          this.messageSeq = 0x01
          data.copy(this.multipartBuffer, this.multipartLength, 2, data.length)
          this.multipartLength += telLen - 2
        } else {
          if (seq === 0) {
            this.messageSeq = seq
            data.copy(this.multipartBuffer, this.multipartLength, 1, data.length)
            this.multipartLength += telLen - 1
          } else {
            if (seq === this.messageSeq + 1) {
              this.messageSeq = seq
              data.copy(this.multipartBuffer, this.multipartLength, 1, data.length)
              this.multipartLength += telLen - 1
            } else {
              console.log('message sequence Error', seq, this.messageSeq, data)
            }
          }
        }

        break
      case 3:
        if (seq === this.messageSeq + 1 && this.multipartLength > 0) {
          if (this.multipartLength === 0) {
            data.copy(this.multipartBuffer, this.multipartLength, 0, data.length)
            this.multipartLength = telLen
          } else {
            this.messageSeq = seq
            data.copy(this.multipartBuffer, this.multipartLength, 1, data.length)
            this.multipartLength += telLen - 1
          }
          let finalMessage = this.multipartBuffer.slice(0, this.multipartLength)
          await this.status(finalMessage, this.multipartLength)
          this.multipartLength = 0
          this.multipartBuffer = Buffer.alloc(65536)
          this.messageSeq = 0
        } else {
          console.log('message sequence Error')
          this.multipartLength = 0
          this.multipartBuffer = Buffer.alloc(65536)
          this.messageSeq = 0
        }
    }
  }
}
