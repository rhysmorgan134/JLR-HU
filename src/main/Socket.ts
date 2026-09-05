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
  mostSubscriptions = new Map<string, object>()
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
        this.config = settings
        this.saveSettings(settings)
        this.emit('appSettings', settings)
        this.sendSettings()
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

      socket.on('mostUsb:getSettings', () => this.emit('mostUsb:getSettings'))
      socket.on('mostUsb:saveSettings', (settings: UsbSettings) => this.emit('mostUsb:saveSettings', settings))

      socket.on('button', (data) => {
        this.emit('button', data)
      })

      socket.on('setSource', (data) => {
        this.emit('setSource', data)
      })

      socket.on('mostDiagnostics:requestRegistry', () => this.emit('mostDiagnostics:requestRegistry'))
      socket.on('mostDiagnostics:subscribe', (data) => this.emit('mostDiagnostics:subscribe', data))
      socket.on('mostDiagnostics:requestFunctions', (data) => this.emit('mostDiagnostics:requestFunctions', data))
      socket.on('mostDiagnostics:subscribeFunctions', (data) => this.emit('mostDiagnostics:subscribeFunctions', data))
      socket.on('mostDiagnostics:send', (data) => this.emit('mostDiagnostics:send', data))
      socket.on('mostDiagnostics:setLogging', (enabled) => this.emit('mostDiagnostics:setLogging', enabled))
      socket.on('mostDiagnostics:getSubscriptions', () => {
        socket.emit('mostDiagnostics:subscriptions', Array.from(this.mostSubscriptions.values()))
      })
      socket.on('piMostFirmware:bootToDfu', () => this.emit('piMostFirmware:bootToDfu'))
      socket.on('piMostFirmware:flash', (data, callback) => this.emit('piMostFirmware:flash', { data, callback }))
      socket.on('update:list', (callback) => this.emit('update:list', callback))
      socket.on('update:install', (data, callback) => this.emit('update:install', { data, callback }))
      socket.on('system:reboot', () => this.emit('system:reboot'))
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
    if (type === 'NetworkMaster') {
      //console.log(`emitting ${type}\n${JSON.stringify(data, null, 2)}`)
    } else {
      console.log('emitting', type, data)
    }
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

  sendDiagnosticsMessage(data: object) {
    this.io.emit('mostDiagnostics:message', data)
  }

  sendDiagnosticsRegistry(data: object[]) {
    this.io.emit('mostDiagnostics:registry', data)
  }

  sendDiagnosticsFunctions(device: object, functions: number[], error?: string) {
    this.io.emit('mostDiagnostics:functions', { device, functions, error })
  }

  setMostSubscription(key: string, data: object) {
    this.mostSubscriptions.set(key, data)
    this.io.emit('mostDiagnostics:subscriptions', Array.from(this.mostSubscriptions.values()))
  }

  replaceApplicationSubscriptions(subscriptions: Array<{ key: string; value: object }>) {
    for (const key of Array.from(this.mostSubscriptions.keys())) {
      if (key.startsWith('application:')) this.mostSubscriptions.delete(key)
    }
    for (const subscription of subscriptions) {
      this.mostSubscriptions.set(subscription.key, subscription.value)
    }
    this.io.emit('mostDiagnostics:subscriptions', Array.from(this.mostSubscriptions.values()))
  }

  sendDiagnosticsLogging(data: object) {
    this.io.emit('mostDiagnostics:logging', data)
  }

  sendFirmwareProgress(data: object) {
    this.io.emit('piMostFirmware:progress', data)
  }

  sendUpdateProgress(data: object) {
    this.io.emit('update:progress', data)
  }

  sendToRoom(room: string, data: Object, type: string, value: boolean | number | string | object) {
    this.io.to(room).emit(type, value)
  }
}
