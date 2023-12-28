// import {Message} from "*can.node";
import * as can from 'socketcan'
import EventEmitter from 'events'
import { CanConfig } from './Globals'
import { Socket } from './Socket'

type CanMask = {
  id: number
  mask: number
  invert: boolean
}

export class Canbus extends EventEmitter {
  channel: can.channel
  canChannel: string
  subscriptions: CanConfig
  masks: CanMask[]
  reverse: boolean
  lights: boolean
  socket: Socket
  constructor(canChannel: string, socket: Socket, subscriptions: CanConfig = {}) {
    super()
    this.canChannel = canChannel
    this.subscriptions = subscriptions
    this.channel = can.createRawChannel(this.canChannel)
    this.masks = []
    this.reverse = false
    this.lights = false
    this.socket = socket
    Object.keys(this.subscriptions).forEach((sub) => {
      this.masks.push({
        id: this.subscriptions[sub].canId,
        mask: this.subscriptions[sub].canId,
        invert: false
      })
    })
    //this.channel.setRxFilters(this.masks)

    this.channel.addListener('onMessage', (msg) => {
      let data
      let tempReverse
      let tempLights = this.lights

      switch (msg.id) {
        case this.subscriptions?.reverse?.canId:
          console.log('reverse message!!!!!!')
          data = msg.data[this.subscriptions!.reverse!.byte] & this.subscriptions!.reverse!.mask
          console.log(data)
          if (data) {
            tempReverse = true
          } else {
            tempReverse = false
          }
          if (tempReverse !== this.reverse) {
            console.log('sending reverse', tempReverse)
            this.socket.sendReverse(tempReverse)
            this.reverse = tempReverse
          }
          break
        case this.subscriptions?.lights?.canId:
          data = msg.data[this.subscriptions!.reverse!.byte] & this.subscriptions!.reverse!.mask
          if (data) {
            tempLights = true
          } else {
            tempLights = false
          }
          if (tempLights !== this.lights) {
            this.socket.sendLights(this.lights)
          }
          break
      }
    })

    this.channel.start()
  }
}
