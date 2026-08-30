import { Action, ExtraConfig } from './Globals'
import { Server } from 'socket.io'
import { EventEmitter } from 'events'
import { messages } from 'socketmost'
import { UsbSettings } from 'socketmost'

export enum MessageNames {
  Connection = 'connection',
  GetSettings = 'getSettings',
  SaveSettings = 'saveSettings',
  Stream = 'stream',
  Action = 'action'
}

export class Socket extends EventEmitter {
  config: ExtraConfig
  io: Server
  saveSettings: (settings: ExtraConfig) => void
  constructor(config: ExtraConfig, saveSettings: (settings: ExtraConfig) => void) {
    super()
    this.config = config
    this.saveSettings = saveSettings
    this.io = new Server({
      cors: {
        origin: '*'
      }
    })

    this.io.on(MessageNames.Connection, (socket) => {
      this.sendSettings()
      this.emit('newConnection')
      console.log('new connection')
      socket.on(MessageNames.GetSettings, () => {
        this.sendSettings()
      })

      socket.on(MessageNames.SaveSettings, (settings: ExtraConfig) => {
        this.saveSettings(settings)
      })

      socket.on(MessageNames.Stream, (stream: messages.Stream) => {
        this.emit(MessageNames.Stream, stream)
      })

      socket.on(MessageNames.Action, (action: Action) => {
        this.emit(MessageNames.Action, action)
      })

      socket.on('allocate', (source) => {
        this.emit('allocate', source)
      })

      socket.on('testMessage', () => {
        this.emit('testMessage')
      })

      socket.on('newSwitch', (source: number) => {
        this.emit('newSwitch', source)
      })

      socket.on('carplaySwitch', () => {
        this.emit('carplaySwitch')
      })

      socket.on('saveSettings', (settings: UsbSettings) => {
        console.log('saving settings in socket', settings)
        this.emit('saveSettings', settings)
      })

      socket.on('button', (data) => {
        this.emit('button', data)
      })

      socket.on('setSource', (data) => {
        this.emit('setSource', data)
      })
    })

    this.io.listen(4000)
  }

  sendSettings() {
    this.io.emit('settings', this.config)
  }

  sendReverse(reverse: boolean) {
    this.io.emit('reverse', reverse)
  }

  sendLights(lights: boolean) {
    this.io.emit('lights', lights)
  }

  sendStatusUpdate(type: string, data: object) {
    console.log('emitting', type, data)
    this.io.emit(type, data)
  }

  sendMostSettings(settings: UsbSettings) {
    console.log('sending most settings')
    this.io.emit('usbSettings', settings)
  }

  sendScreensaver(screensaver: boolean) {
    console.log('screensaver', screensaver)
    this.io.emit('screensaver', screensaver)
  }

  sendToRoom(room: string, data: Object, type: string, value: boolean | number | string | object) {
    this.io.to(room).emit(type, value)
  }
}
