import { MostRxMessage, SocketMostSendMessage } from 'socketmost'
import { Device, ErrorTypes, OpType, SubscriptionRecord } from './types'
import { SocketMostUsb } from 'socketmost'
import winston from 'winston'
import { EventEmitter } from 'events'
import { Socket } from '../Socket'
import { SubscriptionManager } from './SubscriptionManager'
import { getLogger } from '../log'
import { LoggerName } from '../Globals'

export abstract class FBlock extends EventEmitter {
  subscriptions: number[]
  physicalDevice: Device | null = null
  shadowDevice: Device | null = null
  socketmost: SocketMostUsb
  autoSubscribe: boolean
  isShadow: boolean
  isPhysical: boolean
  logger: winston.Logger
  status: Object
  waitingAck: boolean
  methodSend: MethodSend
  socket: Socket
  room: null | string
  inProgressMultipart: Object
  subscriptionManager: SubscriptionManager
  subscriptionRecord: SubscriptionRecord | null
  protected constructor(
    subscriptions: number[],
    physicalDevice: Device | null,
    shadowDevice: Device | null,
    socketmost: SocketMostUsb,
    autoSubscribe: boolean,
    socket: Socket,
    subscriptionManager: SubscriptionManager
  ) {
    super()
    this.status = {}
    this.inProgressMultipart = {}
    this.logger = getLogger(this.constructor.name as LoggerName)
    this.subscriptions = subscriptions
    this.subscriptionManager = subscriptionManager
    this.physicalDevice = physicalDevice
    this.shadowDevice = shadowDevice
    this.socketmost = socketmost
    this.autoSubscribe = autoSubscribe
    // noinspection RedundantConditionalExpressionJS
    this.isShadow = this.shadowDevice ? true : false
    // noinspection RedundantConditionalExpressionJS
    this.isPhysical = this.physicalDevice ? true : false
    this.waitingAck = false
    this.methodSend = new MethodSend(this.logger, this.socketmost)
    this.room = null
    this.socket = socket
    this.subscriptionRecord =
      this.physicalDevice != null
        ? {
            owner: this.constructor.name,
            fBlockID: this.physicalDevice.fBlockID,
            instanceID: this.physicalDevice.instanceID,
            sourceAddressHigh: 0x01,
            sourceAddressLow: 0x6e,
            subscriptionList: subscriptions,
            targetAddressHigh: this.physicalDevice.addressHigh,
            targetAddressLow: this.physicalDevice.addressLow
          }
        : null
    this.methodSend.on('waiting', (waiting) => {
      this.waitingAck = waiting
    })
    if (this.autoSubscribe) {
    }
  }

  abstract parseMessage(message: MostRxMessage): void
  abstract parseShadowMessage(message: MostRxMessage): void
  abstract allocate(message: MostRxMessage): void
  abstract deallocate(message: MostRxMessage): void
  abstract startSource(): void
  abstract stopSource(): void

  checkMessage(message: MostRxMessage) {
    //check if this is a multipart messate
    if (message.telID === 0x01) {
      //multipart, copy message to buffer and set sequence
      this.inProgressMultipart[message.fktID] = message
      this.inProgressMultipart[message.fktID]['seq'] = message.data[0]
      this.inProgressMultipart[message.fktID]['data'] = this.inProgressMultipart[message.fktID][
        'data'
      ].subarray(1, message.telLen)
    } else if (message.telID === 0x02 || message.telID === 0x03) {
      //multipart but message should exist in buffer, check it does
      if (message.fktID in this.inProgressMultipart) {
        //check sequence is correct and no messages have been missed
        if (message.data[0] === this.inProgressMultipart[message.fktID]['seq'] + 1) {
          //add data to buffered message
          this.inProgressMultipart[message.fktID]['data'] = Buffer.concat([
            this.inProgressMultipart[message.fktID]['data'],
            message.data.subarray(1, message.telLen)
          ])
          //update sequence
          this.inProgressMultipart[message.fktID]['seq'] = message.data[0]
          if (message.telID == 0x03) {
            //multipart finished
            try {
              this.logger.info(
                `multipart received final: ${this.convertMessageToHex(
                  this.inProgressMultipart[message.fktID]
                )}`
              )
              //call function
              this[message.fktID](this.inProgressMultipart[message.fktID])
              delete this.inProgressMultipart[message.fktID]
            } catch (e) {
              const error = e instanceof Error ? e : new Error(String(e))
              this.logger.error(`unhandled function\n${error.stack || error.message}`)
            }
          }
        } else {
          //multipart sequence wrong
          this.socketmost.sendControlMessage(
            this.createErrorMessage(message, ErrorTypes.SegmentationError)
          )
          delete this.inProgressMultipart[message.fktID]
        }
      } else {
        //message not in buffer
        this.socketmost.sendControlMessage(
          this.createErrorMessage(message, ErrorTypes.SegmentationError)
        )
      }
    } else {
      try {
        if (this.waitingAck) {
          this.methodSend.checkMessage(message)
        }
        if (message.opType != OpType.resultAck && message.opType != OpType.processingAck) {
          this[message.fktID](message)
        }
      } catch (e) {
        this.logger.error('unhandled function ' + this.convertMessageToHex(message))
        this.logger.error(e)
      }
    }
  }

  /**
   * Handles the source-routed steering-wheel/front-panel commands carried by
   * Function 0xE00. These arrive on whichever source shadow is active rather
   * than on the HMI FBlock.
   */
  protected handleGenericSourceButton(message: MostRxMessage): boolean {
    const data = message.data.subarray(0, message.telLen)

    // A normal next/skip press is sent as F0 01. The following 02 11 01
    // message is the associated key feedback request and must not skip twice.
    if (data.length === 2 && data[0] === 0xf0 && data[1] === 0x01) {
      this.logger.info(`${this.constructor.name} skip-forward button pressed`)
      this.emit('genericButton', { action: 'skipForward', press: 'short' })
      return true
    }

    // Long-press frames use 04 <stage> 00 00 00 00 01. We deliberately expose
    // these without assigning behaviour yet; stages 03/04 are seen in the log.
    if (data.length === 7 && data[0] === 0x04 && data[6] === 0x01) {
      this.logger.info(
        `${this.constructor.name} generic button long press (stage 0x${data[1].toString(16)})`
      )
      this.emit('genericButton', {
        action: 'unassigned',
        press: 'long',
        code: data[1]
      })
      return true
    }

    // 02 11 01 accompanies the short command above and is intentionally
    // consumed so it does not appear as an unhandled source function.
    if (data.length === 3 && data[0] === 0x02 && data[1] === 0x11 && data[2] === 0x01) {
      return true
    }

    return false
  }

  0xe00(message: MostRxMessage): void {
    if (!this.handleGenericSourceButton(message)) {
      this.logger.debug(
        `${this.constructor.name} unrecognised 0xe00 payload: ${message.data
          .subarray(0, message.telLen)
          .toString('hex')}`
      )
    }
  }

  // noinspection JSUnusedGlobalSymbols
  0x1(message: MostRxMessage) {
    // notifications
    for (let i = 3; i < message.telLen; i += 2) {
      let fktId = message.data.readUInt16BE(i)
      if (fktId in this.status) {
        this.createResponseMessage(message, [this.status[fktId]], OpType.status)
        this.logger.info(
          'debug ' +
            this.convertMessageToHex(
              this.createResponseMessage(message, [this.status[fktId]], OpType.status)
            )
        )
      } else {
        this.logger.error('notification not present: ' + message.fBlockID + ' ' + message.fktID)
      }
    }
  }

  // noinspection JSUnusedGlobalSymbols
  0xc81(message: MostRxMessage) {
    // set fblock status
    if (message.data[0] === 0x00) {
      this.logger.info(
        `${this.constructor.name} shadow ${message.fBlockID.toString(
          16
        )} instID ${message.instanceID.toString(16)} active`
      )
      this.socketmost.sendControlMessage(this.createResponseMessage(message, [], OpType.status))
      if (this.autoSubscribe) {
        setTimeout(() => {
          this.subscribe()
        }, 200)
      }
    } else if (message.data[0] === 0x02) {
      this.logger.info(
        `${this.constructor.name} shadow ${message.fBlockID.toString(
          16
        )} instID ${message.instanceID.toString(16)} standby`
      )
      this.socketmost.sendControlMessage(this.createResponseMessage(message, [], OpType.status))
    } else if (message.data[0] === 0x03) {
      this.logger.warn(
        `${this.constructor.name} shadow ${message.fBlockID.toString(
          16
        )} instID ${message.instanceID.toString(16)} disabled`
      )
      this.socketmost.sendControlMessage(this.createResponseMessage(message, [], OpType.status))
    }
  }

  0x101(message: MostRxMessage) {
    //Allocate
    this.socketmost.sendControlMessage(
      this.createErrorMessage(message, ErrorTypes.FktIDNotAvailable)
    )
  }

  0x102(message: MostRxMessage) {
    // deallocate
    this.socketmost.sendControlMessage(
      this.createErrorMessage(message, ErrorTypes.FktIDNotAvailable)
    )
  }

  subscribe() {
    // if (this.subscriptions.length > 4) {
    //   for (let i = 0; i < this.subscriptions.length; i += 4) {
    //     this.socketmost.sendControlMessage(
    //       this.physicalMessage(OpType.set, 0x01, [
    //         0x01,
    //         this.socketmost.settings.nodeAddressHigh,
    //         this.socketmost.settings.nodeAddressLow,
    //         ...(this.subscriptions.length < i + 4
    //           ? this.subscriptions.slice(i, this.subscriptions.length)
    //           : this.subscriptions.slice(i, i + 4))
    //       ])
    //     )
    //   }
    // } else {
    //   this.socketmost.sendControlMessage(
    //     this.physicalMessage(OpType.set, 0x01, [
    //       0x01,
    //       this.socketmost.settings.nodeAddressHigh,
    //       this.socketmost.settings.nodeAddressLow,
    //       ...this.subscriptions
    //     ])
    //   )
    // }
    this.subscriptionManager.createSubscription(this.subscriptionRecord!)
  }

  subscribeAll() {
    this.socketmost.sendControlMessage(
      this.physicalMessage(OpType.set, 0x01, [
        0x00,
        this.socketmost.settings.nodeAddressHigh,
        this.socketmost.settings.nodeAddressLow
      ])
    )
  }

  updateStatus(data) {
    this.status = { ...this.status, ...data }
    this.socket.sendStatusUpdate(this.constructor.name, data)
    this.logger.info('status update: ' + this.constructor.name + JSON.stringify(this.status))
  }

  unsubscribe() {
    this.socketmost.sendControlMessage(
      this.physicalMessage(OpType.set, 0x01, [
        0x02,
        this.socketmost.settings.nodeAddressHigh,
        this.socketmost.settings.nodeAddressLow
      ])
    )
  }

  physicalMessage(opType: number, functionId: number, data: number[]): SocketMostSendMessage {
    return {
      targetAddressHigh: this.physicalDevice.addressHigh,
      targetAddressLow: this.physicalDevice.addressLow,
      opType: opType,
      fBlockID: this.physicalDevice.fBlockID,
      fktID: functionId,
      instanceID: this.physicalDevice.instanceID,
      data: data
    }
  }

  createResponseMessage(
    message: MostRxMessage,
    data: number[] | Buffer,
    opType: OpType
  ): SocketMostSendMessage {
    return {
      targetAddressHigh: message.sourceAddrHigh,
      targetAddressLow: message.sourceAddrLow,
      fBlockID: message.fBlockID,
      instanceID: message.instanceID,
      opType: opType,
      fktID: message.fktID,
      data: data
    }
  }

  createErrorMessage(message: MostRxMessage, error: ErrorTypes): SocketMostSendMessage {
    let out = this.createResponseMessage(message, [error], OpType.error)
    this.logger.error(`Sending Error Resp ${this.convertMessageToHex(out)}`)
    return out
  }

  convertMessageToHex(message) {
    let out = {}
    for (const [key, value] of Object.entries(message)) {
      if (typeof value === 'number') {
        out[key] = '0x' + value.toString(16)
      }
    }
    out['data'] = []
    message.data.forEach((v) => {
      out['data'].push('0x' + v.toString(16))
    })
    return JSON.stringify(out)
  }

  async sendMethod(message: SocketMostSendMessage) {
    try {
      await this.methodSend.sendMessage(message)
      return 1
    } catch (e) {
      return -1
    }
  }
}

class MethodSend extends EventEmitter {
  waitingResponse: boolean
  functionID: number
  retryCount: number
  maxRetries: number
  responseMessage: MostRxMessage | null
  messageToSend: SocketMostSendMessage
  logger: winston.Logger
  checkInterval: null | NodeJS.Timeout
  socketmost: SocketMostUsb
  constructor(logger: winston.Logger, socketmost: SocketMostUsb, maxRetries = 3) {
    super()
    this.maxRetries = maxRetries
    this.responseMessage = null
    this.functionID = null
    this.messageToSend = null
    this.waitingResponse = false
    this.logger = logger
    this.socketmost = socketmost
  }

  sendMessage(message: SocketMostSendMessage) {
    return new Promise((resolve, reject) => {
      this.waitingResponse = true
      this.functionID = message.fktID
      this.retryCount = 0
      this.responseMessage = null
      this.messageToSend = message
      this.logger.info(`sending message as method ${this.convertMessageToHex(message)}`)
      this.socketmost.sendControlMessage(message)
      this.emit('waiting', true)
      this.once('finished', (opType) => {
        if (opType === OpType.resultAck) {
          resolve(1)
        } else {
          reject(-1)
        }
      })
    })
  }

  checkMessage(message: MostRxMessage) {
    this.logger.debug(`checking ${message.fktID} against ${this.functionID}`)
    if (message.fktID === this.functionID) {
      this.responseMessage = message
      switch (this.responseMessage.opType) {
        case OpType.processingAck:
          this.logger.debug(`message processing 0x${this.functionID.toString(16)}`)
          break
        case OpType.errorAck:
          this.logger.debug(`Method Error ${this.convertMessageToHex(this.responseMessage)}`)
          clearInterval(this.checkInterval)
          this.emit('finished', this.responseMessage.opType)
          this.emit('waiting', false)
          break
        case OpType.resultAck:
          this.logger.debug(`Method resolved ${this.convertMessageToHex(this.responseMessage)}`)
          this.emit('finished', this.responseMessage.opType)
          this.emit('waiting', false)
      }
    }
  }

  convertMessageToHex(message) {
    let out = {}
    for (const [key, value] of Object.entries(message)) {
      if (typeof value === 'number') {
        out[key] = '0x' + value.toString(16)
      }
    }
    out['data'] = []
    message.data.forEach((v) => {
      out['data'].push('0x' + v.toString(16))
    })
    return JSON.stringify(out)
  }
}
