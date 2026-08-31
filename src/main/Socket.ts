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
      this.sendDiagnosticsSubscriptions()
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

      socket.on('mostDiagnostics:requestRegistry', () => {
        this.emit('mostDiagnostics:requestRegistry')
      })

      socket.on('mostDiagnostics:subscribe', (data) => {
        this.emit('mostDiagnostics:subscribe', data)
      })

      socket.on('mostDiagnostics:send', (data) => {
        this.emit('mostDiagnostics:send', data)
      })

      socket.on('mostDiagnostics:setLogging', (enabled) => {
        this.emit('mostDiagnostics:setLogging', enabled)
      })

      socket.on('mostDiagnostics:getSubscriptions', () => {
        socket.emit(
          'mostDiagnostics:subscriptions',
          Array.from(this.mostSubscriptions.values())
        )
      })

      socket.on('mostUsb:getSettings', () => {
        this.emit('mostUsb:getSettings')
      })

      socket.on('mostUsb:saveSettings', (settings) => {
        this.emit('mostUsb:saveSettings', settings)
      })

      socket.on('mostUsb:bootToDfu', () => {
        this.emit('mostUsb:bootToDfu')
      })

      socket.on('mostLogs:list', (callback) => this.emit('mostLogs:list', callback))
      socket.on('mostLogs:read', (fileName, callback) => {
        this.emit('mostLogs:read', { fileName, callback })
      })
    })

    this.io.listen(4000)
  }

  sendSettings() {
    console.log('sending settings' + this.config)
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

  sendDiagnosticsMessage(data: object) {
    this.io.emit('mostDiagnostics:message', data)
  }

  sendDiagnosticsRegistry(data: object[]) {
    this.io.emit('mostDiagnostics:registry', data)
  }

  setMostSubscription(key: string, data: object) {
    this.mostSubscriptions.set(key, data)
    this.sendDiagnosticsSubscriptions()
  }

  removeMostSubscription(key: string) {
    this.mostSubscriptions.delete(key)
    this.sendDiagnosticsSubscriptions()
  }

  sendDiagnosticsSubscriptions() {
    this.io.emit('mostDiagnostics:subscriptions', Array.from(this.mostSubscriptions.values()))
  }

  sendDiagnosticsLogging(data: object) {
    this.io.emit('mostDiagnostics:logging', data)
  }

  sendToRoom(room: string, data: Object, type: string, value: boolean | number | string | object) {
    this.io.to(room).emit(type, value)
  }
}
