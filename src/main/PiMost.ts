import { SocketMostUsb, messages, JlrAudioControl, UsbServer } from 'socketmost'

import { MessageNames, Socket } from './Socket'
import { AudioDiskPlayer } from './PiMostFunctions/AudioDiskPlayer/AudioDiskPlayer'
import { AmFmTuner } from './PiMostFunctions/AmFm/AmFmTuner'
import { fBlocks, opTypes } from './PiMostFunctions/Common/enums'
import { Action, AvailableSources, SourceRecord } from './Globals'
import { U240 } from './PiMostFunctions/JlrAudio/u240'
import { Amplifier } from './PiMostFunctions/Amplifier/Amplifier'
import { CanGateway } from './PiMostFunctions/CanGateway/CanGateway'
import { Climate } from './PiMostFunctions/Climate/Climate'
import winston from 'winston'
import { ModuleSingle, UsbSettings } from 'socketmost'

const { Os8104Events } = messages

type Interfaces = {
  AudioDiskPlayer: AudioDiskPlayer
  u240: U240
  AmFmTuner: AmFmTuner
  Amplifier: Amplifier
  SecAmplifier: Amplifier
  TertiaryAmplifier: Amplifier
  CanGateway: CanGateway
  Climate: Climate
  // Sources: Source
}

const sourceMap: Record<string, SourceRecord> = {
  amFmTuner: {
    fBlockID: 0x40,
    instanceID: 0x01,
    shadow: 0xa1,
    addressHigh: 0x01,
    addressLow: 0x80,
    name: 'amFmTuner'
  },
  dabTuner: {
    fBlockID: 0x43,
    instanceID: 0x01,
    shadow: 0xa1,
    addressHigh: 0x01,
    addressLow: 0x80,
    name: 'dabTuner'
  },
  audioDiskPlayer: {
    fBlockID: 0x31,
    instanceID: 0x02,
    shadow: 0xa1,
    addressHigh: 0x01,
    addressLow: 0x80,
    name: 'audioDiskPlayer'
  },
  usbAudio: {
    fBlockID: 0x31,
    instanceID: 0x05,
    shadow: 0xa2,
    addressHigh: 0x01,
    addressLow: 0x6e,
    name: 'usbAudio'
  },
  unknown: {
    fBlockID: 0x23,
    instanceID: 0x05,
    shadow: 0xa1,
    addressHigh: 0x01,
    addressLow: 0x86,
    name: 'unknown'
  },
  auxIn: {
    fBlockID: 0x24,
    instanceID: 0x01,
    shadow: 0xa1,
    addressHigh: 0x01,
    addressLow: 0x80,
    name: 'auxIn'
  },
  carplay: {
    fBlockID: 0x31,
    instanceID: 0x03,
    shadow: 0xa4,
    addressHigh: 0x01,
    addressLow: 0x6e,
    name: 'carplay'
  }
}

type InterfaceKeys = keyof Interfaces

const hasInterface = (obj: Interfaces, prop: string): prop is InterfaceKeys =>
  Object.prototype.hasOwnProperty.call(obj, prop)

export class PiMost {
  socketMostClient: SocketMostUsb
  socket: Socket
  connected: boolean
  timeoutType: string
  subscriptionTimer: NodeJS.Timeout | null
  interfaces: Interfaces
  stabilityTimeout: null | NodeJS.Timeout
  sourcesInterval: null | NodeJS.Timeout
  currentSource: AvailableSources
  jlrAudioControl: JlrAudioControl
  logger: winston.Logger
  usbServer: UsbServer
  subscriptions: ModuleSingle[]
  mostSettings: UsbSettings
  constructor(socket: Socket) {
    console.log('creating client in PiMost')
    this.socketMostClient = new SocketMostUsb()
    this.usbServer = new UsbServer(this.socketMostClient)
    this.jlrAudioControl = new JlrAudioControl(this.socketMostClient)
    this.connected = false
    this.socket = socket
    this.subscriptionTimer = null
    this.timeoutType = ''
    this.logger = winston.loggers.get('jlrHU')
    this.socket.on(MessageNames.Stream, (stream) => {
      this.stream(stream)
    })
    this.jlrAudioControl.on('softStart', () => {
      console.log('softStart')
      socket.sendScreensaver(false)
    })

    this.jlrAudioControl.on('softShutdown', () => {
      console.log('softShutdown')
      socket.sendScreensaver(true)
    })
    this.subscriptions = []
    const audioDiskPlayer = new AudioDiskPlayer(0x02, this.sendMessage, 0x01, 0x80, 0x01, 0x6e)
    const u240 = new U240(0x01, this.sendMessage, 0x01, 0x61, 0x01, 0x6e)
    const amFmTuner = new AmFmTuner(0x01, this.sendMessage, 0x01, 0x80, 0x01, 0x6e)
    const amplifier = new Amplifier(0xa1, this.sendMessage, 0x01, 0x61, 0x01, 0x6e)
    const secAmplifier = new Amplifier(0x05, this.sendMessage, 0x01, 0x86, 0x01, 0x6e)
    const tertiaryAmplifier = new Amplifier(0xa1, this.sendMessage, 0x01, 0x61, 0x01, 0x6e)
    const canGateway = new CanGateway(0x01, this.sendMessage, 0x01, 0x61, 0x01, 0x6e)
    const climate = new Climate(0xa1, this.sendMessage, 0x01, 0x61, 0x01, 0x6e)
    // const sources = new Source(0xa3, this.sendMessage, 0x01, 0x6e, 0x01, 0x10)
    // this.interfaces.secAmplifier = new Amplifier(0x20, this.sendMessage, 0x01, 0x86, 0x01, 0x10)
    this.interfaces = {
      AudioDiskPlayer: audioDiskPlayer,
      u240: u240,
      AmFmTuner: amFmTuner,
      Amplifier: amplifier,
      SecAmplifier: secAmplifier,
      TertiaryAmplifier: tertiaryAmplifier,
      CanGateway: canGateway,
      Climate: climate
      // Sources: sources
    }
    this.logger.debug(`Created interfaces ${JSON.stringify(this.interfaces)}`)
    this.stabilityTimeout = null
    this.sourcesInterval = null
    this.currentSource = 'AmFmTuner'

    this.socketMostClient.on('opened', () => {
      if (!this.connected) {
        this.connected = true
        this.logger.info('SocketMost-client connected, settings up events')
        this.interfaces.AudioDiskPlayer.on('statusUpdate', (data) => {
          socket.sendStatusUpdate('audioDiskPlayerUpdate', data)
        })
        this.interfaces.u240.on('statusUpdate', (data) => {
          socket.sendStatusUpdate('volumeUpdate', data)
        })
        this.interfaces.AmFmTuner.on('statusUpdate', (data) => {
          socket.sendStatusUpdate('amFmTunerUpdate', data)
        })
        this.interfaces.Amplifier.on('statusUpdate', (data) => {
          socket.sendStatusUpdate('amplifierUpdate', data)
        })
        this.interfaces.CanGateway.on('statusUpdate', (data) => {
          socket.sendStatusUpdate('canGatewayUpdate', data)
        })
        this.interfaces.Climate.on('statusUpdate', (data) => {
          socket.sendStatusUpdate('climateUpdate', data)
        })
        this.socketMostClient.sendCheckForLock()
        // this.interfaces.Sources.on('sourcesUpdate', (data) => {
        //   socket.sendStatusUpdate('sourcesUpdate', data)
        // })

        socket.on('newConnection', () => {
          this.logger.info('Socket.io client connected, sending full update')
          socket.sendStatusUpdate(
            'audioDiskPlayerFullUpdate',
            this.interfaces.AudioDiskPlayer.state
          )
          socket.sendStatusUpdate('volumeFullUpdate', this.interfaces.u240.state)
          socket.sendStatusUpdate('amFmTunerFullUpdate', this.interfaces.AmFmTuner.state)
          socket.sendStatusUpdate('amplifierFullUpdate', this.interfaces.Amplifier.state)
          socket.sendStatusUpdate('canGatewayFullUpdate', this.interfaces.CanGateway.state)
          socket.sendStatusUpdate('climateFullUpdate', this.interfaces.Climate.state)
          socket.sendMostSettings(this.mostSettings)
          // socket.sendStatusUpdate('sourcesFullUpdate', this.interfaces.Sources.state)
        })

        socket.on('action', (message: Action) => {
          this.logger.debug(`action request: ${JSON.stringify(message)}`)
          const { fktID, opType, type, data, method } = message
          const methodGroup = opTypes[method]
          const opTypeString = methodGroup[opType as keyof typeof methodGroup]
          if (hasInterface(this.interfaces, type)) {
            this.interfaces[type].functions[fktID].actionOpType[opTypeString](data)
          }
        })

        socket.on('saveSettings', (settings: UsbSettings) => {
          console.log('saving settings in pimost', settings)
          this.socketMostClient.saveSettings(settings)
        })

        this.socketMostClient.on(Os8104Events.Settings, (data) => {
          console.log('settings')
          this.mostSettings = data
          this.socket.sendMostSettings(data)
        })

        this.socketMostClient.on('opened', () => {
          this.logger.info('usb connection opened')
        })
        //
        // this.jlrAudioControl.on('softStart', () => {
        //   console.log('softStart')
        //   socket.sendScreensaver(false)
        // })
        //
        // this.jlrAudioControl.on('softShutdown', () => {
        //   console.log('softShutdown')
        //   socket.sendScreensaver(true)
        // })

        // socket.on('allocate', (source) => {
        //   this.changeSource(source)
        // })

        socket.on('newSwitch', (source: string) => {
          console.log('switching to: ', source)
          this.jlrAudioControl.switchSource(sourceMap[source])
        })

        this.socketMostClient.on(Os8104Events.Unocked, () => {
          this.logger.debug('network locked waiting stability')
          this.socketMostClient.getSettings()
          if (this.stabilityTimeout) clearTimeout(this.stabilityTimeout)
          this.stabilityTimeout = setTimeout(() => {
            this.logger.info('locked and stable, subscribing')
          }, 3000)
        })

        this.socketMostClient.on(Os8104Events.Locked, () => {
          this.logger.warn('unlocked')
          if (this.stabilityTimeout) {
            clearTimeout(this.stabilityTimeout)
          }
          if (this.sourcesInterval) {
            clearInterval(this.sourcesInterval)
          }
        })

        this.socketMostClient.sendCheckForLock()

        this.socketMostClient.on(
          Os8104Events.SocketMostMessageRxEvent,
          (message: messages.MostRxMessage) => {
            this.logger.silly(`message received ${JSON.stringify(message)}`)
            if (message.fBlockID) {
            }
            const type = fBlocks[message.fBlockID as keyof typeof fBlocks]
            if (message.opType === 15) {
              this.logger.warn(`most error: ${JSON.stringify(message)}`)
            }
            if (type === this.timeoutType && this.subscriptionTimer) {
              this.subscriptionTimer.refresh()
            }
            if (hasInterface(this.interfaces, type)) {
              this.interfaces[type].parseMessage(message)
            }
            this.jlrAudioControl.parseMessage(message)
          }
        )
      }
    })
  }

  stream(stream: messages.Stream) {
    this.logger.info(`stream request ${JSON.stringify(stream)}`)
    // this.socketMostClient.stream(stream)
  }

  sendMessage = (message: messages.SocketMostSendMessage) => {
    this.logger.silly(`send message request ${JSON.stringify(message)}`)
    console.log(`send message request ${JSON.stringify(message)}`)
    this.socketMostClient.sendControlMessage(message)
  }

  async subscribeToAll() {
    this.logger.info('subsribing to all')
    for (const k of Object.keys(this.interfaces)) {
      await this.subscribe(k as InterfaceKeys)
    }
  }

  subscribe(interfaceType: InterfaceKeys) {
    // this.socketMostClient.sendControlMessage()
    this.logger.info(`Subscribing to ${JSON.stringify(interfaceType)}`)
    this.interfaces[interfaceType].allNotifcations()
    return new Promise((resolve) => {
      this.timeoutType = interfaceType
      this.subscriptionTimer = setTimeout(() => {
        this.timeoutType = ''
        resolve(true)
      }, 200)
    })
  }

  // async changeSource(newSource: AvailableSources) {
  //   this.logger.warn(`new source deprecated`)
  //   await this.interfaces.SecAmplifier.functions[0x112].startResult([0x01])
  //   await this.disconnectSource()
  //   await this.waitForDealloc(this.currentSource)
  //   await this.allocateSource(newSource)
  //   const data = await this.waitForAlloc(newSource)
  //   await this.interfaces.SecAmplifier.functions[0x111].startResult([
  //     0x01,
  //     data.srcDelay,
  //     ...data.channelList
  //   ])
  // }

  // newSwitchSource(source: string) {
  //   this.logger.info(`Switching source ${source}`)
  //   this.switching.switchSource(source)
  // }

  // async disconnectSource() {
  //   this.logger.info(`disconnecting source`)
  //   await this.interfaces[this.currentSource].functions[0x102].startResult([0x01])
  // }
  //
  // waitForDealloc(source: AvailableSources) {
  //   this.logger.warn('deprecated - waiting for source input to deallocate')
  //   return new Promise((resolve) => {
  //     this.interfaces[source].once('deallocResult', (source) => {
  //       this.logger.warn(`deprecated resolving deallocResult - ${JSON.stringify(source)}`)
  //       resolve(true)
  //     })
  //   })
  // }
  //
  // async allocateSource(source: AvailableSources) {
  //   this.logger.warn(`deprecated - allocating source`)
  //   await this.interfaces[source].functions[0x101].startResult([0x01])
  // }
  //
  // waitForAlloc(source: AvailableSources): Promise<{ srcDelay: number; channelList: number[] }> {
  //   this.logger.info(`deprecated - waiting for alloc`)
  //   return new Promise((resolve) => {
  //     this.interfaces[source].once('allocResult', (results) => {
  //       resolve(results)
  //     })
  //   })
  // }
}
