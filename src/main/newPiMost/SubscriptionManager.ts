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
          message.fktID === 0x2 &&
          message.opType === OpType.status
        ) {
          this.logger.error('Successfull Notification' + this.inProgSubscription!)
          clearInterval(this.notificationCheckTimer!)
          this.subscriptionInProg = false
          this.activeSubscriptions.push(this.inProgSubscription!)
          this.inProgSubscription = null
        }
      }
    })
  }

  createSubscription(details: SubscriptionRecord) {
    if (
      !this.queuedSubscriptions.includes(details) &&
      !this.activeSubscriptions.includes(details)
    ) {
      this.queuedSubscriptions.push(details)
      this.checkForNextSub()
    } else {
      this.logger.info(details + ' Already queued/active')
    }
  }

  checkForNextSub() {
    if (!this.subscriptionInProg && this.queuedSubscriptions.length > 0) {
      this.inProgSubscription = this.queuedSubscriptions.shift()!
      this.subscriptionInProg = true
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

    this.notificationCheckTimer = setInterval(() => {
      if (this.attempts == 3) {
        this.failedSubscriptions.push(this.inProgSubscription!)
        this.logger.error('FAILED SUBSCRIPTION' + this.inProgSubscription!)
        this.inProgSubscription = null
        this.subscriptionInProg = false
        clearInterval(this.notificationCheckTimer!)
        this.checkForNextSub()
      } else {
        this.requestNotificationCheck()
        this.attempts += 1
      }
    }, 200)
  }

  requestNotificationCheck() {
    this.logger.error('Sending notification check' + this.inProgSubscription!)
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
}
