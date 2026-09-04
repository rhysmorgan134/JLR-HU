import { EventEmitter } from 'events'
import { MostRxMessage, Os8104Events, SocketMostUsb } from 'socketmost'
import { OpType, SubscriptionRecord, SubscriptionRecordList } from './types'
import winston from 'winston'

export class SubscriptionManager extends EventEmitter {
  queuedSubscriptions: SubscriptionRecordList
  activeSubscriptions: SubscriptionRecordList
  inProgSubscription: SubscriptionRecord | null = null
  subscriptionInProg: boolean
  failedSubscriptions: SubscriptionRecordList
  socketmost: SocketMostUsb
  notificationCheckTimer: NodeJS.Timeout | null
  attempts: number
  logger: winston.Logger
  constructor(socketmost: SocketMostUsb) {
    super()
    this.queuedSubscriptions = []
    this.activeSubscriptions = []
    this.subscriptionInProg = false
    this.failedSubscriptions = []
    this.inProgSubscription = null
    this.socketmost = socketmost
    this.notificationCheckTimer = null
    this.logger = winston.loggers.get('pimost')
    this.attempts = 0
    this.socketmost.on(Os8104Events.SocketMostMessageRxEvent, (message: MostRxMessage) => {
      if (this.subscriptionInProg) {
        if (
          message.fBlockID === this.inProgSubscription!.fBlockID &&
          message.fktID != 0xc81 &&
          message.opType === OpType.status
        ) {
          this.logger.error(
            `Successfull Notification ${this.convertMessageToHex(this.inProgSubscription!)}`
          )
          clearTimeout(this.notificationCheckTimer!)
          this.subscriptionInProg = false
          this.activeSubscriptions.push(this.inProgSubscription!)
          this.inProgSubscription = null
          this.subscriptionInProg = false
          this.inProgSubscription = null
          this.checkForNextSub()
          this.attempts = 0
        }
      }
    })

    this.socketmost.on(Os8104Events.Unlocked, () => {
      this.queuedSubscriptions = []
      this.activeSubscriptions = []
      this.failedSubscriptions = []
      this.attempts = 0
      clearTimeout(this.notificationCheckTimer!)
    })
  }

  createSubscription(details: SubscriptionRecord) {
    this.logger.warn(`Adding subscription to queue ${this.convertMessageToHex(details)} `)
    if (
      !this.queuedSubscriptions.includes(details) &&
      !this.activeSubscriptions.includes(details)
    ) {
      this.queuedSubscriptions.push(details)
      this.checkForNextSub()
    } else {
      this.logger.warn(`${this.convertMessageToHex(details)} Already queued/active`)
    }
  }

  checkForNextSub() {
    if (!this.subscriptionInProg && this.queuedSubscriptions.length > 0) {
      this.inProgSubscription = this.queuedSubscriptions.shift()!
      this.logger.info(JSON.stringify(this.inProgSubscription))
      this.subscriptionInProg = true
      this.logger.warn(
        `beginning subscription for: ${this.convertMessageToHex(this.inProgSubscription)}`
      )
      this.sendSubscriptionMessage()
    }
  }

  sendSubscriptionMessage() {
    this.socketmost.sendControlMessage({
      data: [
        0x00,
        this.inProgSubscription!.sourceAddressHigh,
        this.inProgSubscription!.sourceAddressLow
      ],
      fBlockID: this.inProgSubscription!.fBlockID,
      fktID: 0x01,
      instanceID: this.inProgSubscription!.instanceID,
      opType: OpType.set,
      targetAddressHigh: this.inProgSubscription!.targetAddressHigh,
      targetAddressLow: this.inProgSubscription!.targetAddressLow
    })

    this.notificationCheckTimer = setTimeout(() => {
      this.failedSubscriptions.push(this.inProgSubscription!)
      this.logger.error(
        `FAILED SUBSCRIPTION: ${this.convertMessageToHex(this.inProgSubscription!)}`
      )
      this.inProgSubscription = null
      this.subscriptionInProg = false
      clearInterval(this.notificationCheckTimer!)
      this.attempts = 0
      this.checkForNextSub()
    }, 1000)
  }

  requestNotificationCheck() {
    this.logger.warn(
      `Sending notification check ${this.convertMessageToHex(this.inProgSubscription!)}`
    )
    this.socketmost.sendControlMessage({
      data: [this.inProgSubscription!.sourceAddressHigh, this.inProgSubscription!.sourceAddressLow],
      fBlockID: this.inProgSubscription!.fBlockID,
      fktID: 0x02,
      instanceID: this.inProgSubscription!.instanceID,
      opType: OpType.get,
      targetAddressHigh: this.inProgSubscription!.targetAddressHigh,
      targetAddressLow: this.inProgSubscription!.targetAddressLow
    })
  }

  convertMessageToHex(message) {
    let out = {}
    for (const [key, value] of Object.entries(message)) {
      if (typeof value === 'number') {
        out[key] = '0x' + value.toString(16)
      }
    }
    return JSON.stringify(out)
  }
}
