import { FktIdPartMessage } from '../../Globals'
import { EventEmitter } from 'events'

export abstract class Fkt extends EventEmitter {
  writeMessage: (message: FktIdPartMessage) => void
  fktID: number
  updateStatus: (result: object) => void
  responseReceived: boolean
  waiting: boolean
  messageSeq: number
  multipartLength: number
  multipartBuffer: Buffer
  actionOpType: Record<string, ((data: number[]) => Promise<void>) | (() => void)>
  constructor(
    fktID: number,
    writeMessage: (message: FktIdPartMessage) => void,
    updateStatus: (result: object) => void
  ) {
    super()
    this.writeMessage = writeMessage
    this.fktID = fktID
    this.responseReceived = false
    this.waiting = false
    this.messageSeq = 0x00
    this.multipartLength = 0x00
    this.multipartBuffer = Buffer.alloc(65536)
    this.updateStatus = updateStatus
    this.actionOpType = {
      Set: this.set,
      Get: this.get,
      SetGet: this.setGet,
      Increment: this.increment,
      Decrement: this.decrement,
      GetInterface: this.getInterface,
      StartResultAck: this.startResultAck,
      Start: this.get,
      StartResult: this.startResult
    }
  }

  get = async (data: number[] = []) => {
    this.responseReceived = false
    this.writeMessage({ fktID: this.fktID, opType: 0x01, data: data })
  }

  getInterface = async (data: number[] = []) => {
    this.responseReceived = false
    this.writeMessage({ fktID: this.fktID, opType: 0x05, data: data })
  }

  set = async (data: number[]) => {
    this.responseReceived = false
    this.writeMessage({ fktID: this.fktID, opType: 0x00, data: data })
  }

  increment = async (data: number[]) => {
    this.responseReceived = false
    this.writeMessage({ fktID: this.fktID, opType: 0x03, data: data })
  }

  decrement = async (data: number[]) => {
    this.responseReceived = false
    this.writeMessage({ fktID: this.fktID, opType: 0x04, data: data })
  }

  startResult = async (data: number[]) => {
    this.responseReceived = false
    this.writeMessage({ fktID: this.fktID, opType: 0x02, data: data })
  }

  startResultAck = async (data: number[]) => {
    this.responseReceived = false
    this.writeMessage({ fktID: this.fktID, opType: 0x06, data: data })
  }

  setGet = async (data: number[]) => {
    this.responseReceived = false
    this.writeMessage({ fktID: this.fktID, opType: 0x02, data: data })
  }

  abstract status(data: Buffer, telLen: number): void

  getReq = (data: number[] = []) => {
    return
  }

  parseStatus = async ({
    telID,
    telLen,
    data
  }: {
    telID: number
    telLen: number
    data: Buffer
  }) => {
    data = Buffer.from(data)
    const seq = data.readUint8(0)
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
          const finalMessage = this.multipartBuffer.slice(0, this.multipartLength)
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
