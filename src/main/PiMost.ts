import { SocketMost, SocketMostClient, messages } from 'socketmost'
import { MessageNames, Socket } from './Socket'
import { AudioDiskPlayer } from './PiMostFunctions/AudioDiskPlayer/AudioDiskPlayer'
import { AmFmTuner } from './PiMostFunctions/AmFm/AmFmTuner'
import { fBlocks, opTypes } from './PiMostFunctions/Common/enums'
import { Action, AvailableSources } from './Globals'
import { U240 } from './PiMostFunctions/JlrAudio/u240'
import { Amplifier } from './PiMostFunctions/Amplifier/Amplifier'
import { CanGateway } from './PiMostFunctions/CanGateway/CanGateway'
import { Climate } from './PiMostFunctions/Climate/Climate'

const { Os8104Events } = messages

type Interfaces = {
  AudioDiskPlayer: AudioDiskPlayer
  U240: U240
  AmFmTuner: AmFmTuner
  Amplifier: Amplifier
  SecAmplifier: Amplifier
  CanGateway: CanGateway
  Climate: Climate
}

type InterfaceKeys = keyof Interfaces

const hasInterface = (obj: Interfaces, prop: string): prop is InterfaceKeys =>
  Object.prototype.hasOwnProperty.call(obj, prop)

export class PiMost {
  socketMost: SocketMost
  socketMostClient: SocketMostClient
  socket: Socket
  timeoutType: string
  subscriptionTimer: NodeJS.Timeout | null
  interfaces: Interfaces
  stabilityTimeout: null | NodeJS.Timeout
  sourcesInterval: null | NodeJS.Timeout
  currentSource: AvailableSources

  constructor(socket: Socket) {
    console.log('creating client in PiMost')
    this.socketMost = new SocketMost()
    this.socketMostClient = new SocketMostClient()
    this.socket = socket
    this.subscriptionTimer = null
    this.timeoutType = ''
    this.socket.on(MessageNames.Stream, (stream) => {
      this.stream(stream)
    })
    const audioDiskPlayer = new AudioDiskPlayer(0x02, this.sendMessage, 0x01, 0x80, 0x01, 0x10)
    const u240 = new U240(0x01, this.sendMessage, 0x01, 0x61, 0x01, 0x10)
    const amFmTuner = new AmFmTuner(0x01, this.sendMessage, 0x01, 0x80, 0x01, 0x10)
    const amplifier = new Amplifier(0xa1, this.sendMessage, 0x01, 0x61, 0x01, 0x10)
    const secAmplifier = new Amplifier(0x05, this.sendMessage, 0x01, 0x86, 0x01, 0x10)
    const canGateway = new CanGateway(0x01, this.sendMessage, 0x01, 0x61, 0x01, 0x10)
    const climate = new Climate(0xa1, this.sendMessage, 0x01, 0x61, 0x01, 0x10)
    // this.interfaces.secAmplifier = new Amplifier(0x20, this.sendMessage, 0x01, 0x86, 0x01, 0x10)
    this.interfaces = {
      AudioDiskPlayer: audioDiskPlayer,
      U240: u240,
      AmFmTuner: amFmTuner,
      Amplifier: amplifier,
      SecAmplifier: secAmplifier,
      CanGateway: canGateway,
      Climate: climate
    }
    this.stabilityTimeout = null
    this.sourcesInterval = null
    this.currentSource = 'AmFmTuner'

    this.socketMostClient.on('connected', () => {
      console.log('client connected')
      this.interfaces.AudioDiskPlayer.on('statusUpdate', (data) => {
        socket.sendStatusUpdate('audioDiskPlayerUpdate', data)
      })
      this.interfaces.U240.on('statusUpdate', (data) => {
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

      socket.on('newConnection', () => {
        console.log('SENDING FULL UPDATE')
        socket.sendStatusUpdate('audioDiskPlayerFullUpdate', this.interfaces.AudioDiskPlayer.state)
        socket.sendStatusUpdate('volumeFullUpdate', this.interfaces.U240.state)
        socket.sendStatusUpdate('amFmTunerFullUpdate', this.interfaces.AmFmTuner.state)
        socket.sendStatusUpdate('amplifierFullUpdate', this.interfaces.Amplifier.state)
        socket.sendStatusUpdate('canGatewayFullUpdate', this.interfaces.CanGateway.state)
        socket.sendStatusUpdate('climateFullUpdate', this.interfaces.Climate.state)
      })

      socket.on('action', (message: Action) => {
        console.log('action request', message)
        const { fktID, opType, type, data, method } = message
        const methodGroup = opTypes[method]
        const opTypeString = methodGroup[opType as keyof typeof methodGroup]
        if (hasInterface(this.interfaces, type)) {
          this.interfaces[type].functions[fktID].actionOpType[opTypeString](data)
        }
      })

      socket.on('allocate', (source) => {
        console.log('received allocate')
        this.changeSource(source)
      })

      this.socketMostClient.on(Os8104Events.Locked, () => {
        console.log('locked')
        if (this.stabilityTimeout) clearTimeout(this.stabilityTimeout)
        this.stabilityTimeout = setTimeout(() => {
          console.log('locked, subscribing')
          //this.sourcesInterval = setInterval(() => {
          // this.interfaces?.secAmplifier?.functions[0xE09].get([])
          //}, 100)
          this.subscribeToAll()
        }, 3000)
      })

      this.socketMostClient.on(Os8104Events.Unlocked, () => {
        console.log('UNLOCKED')
        if (this.stabilityTimeout) {
          clearTimeout(this.stabilityTimeout)
        }
        if (this.sourcesInterval) {
          clearInterval(this.sourcesInterval)
        }
      })

      this.socketMostClient.on(
        Os8104Events.SocketMostMessageRxEvent,
        (message: messages.MostRxMessage) => {
          const type = fBlocks[message.fBlockID as keyof typeof fBlocks]
          if (message.opType === 15) {
            console.log('most error', message)
          }
          if (type === this.timeoutType && this.subscriptionTimer) {
            this.subscriptionTimer.refresh()
          }
          if (hasInterface(this.interfaces, type)) {
            this.interfaces[type].parseMessage(message)
          }
        }
      )
    })
  }

  stream(stream: messages.Stream) {
    this.socketMostClient.stream(stream)
  }

  sendMessage = (message: messages.SocketMostSendMessage) => {
    console.log('send message request', message)
    this.socketMostClient.sendControlMessage(message)
  }

  async subscribeToAll() {
    for (const k of Object.keys(this.interfaces)) {
      await this.subscribe(k as keyof typeof this.interfaces)
    }
  }

  subscribe(interfaceType: keyof typeof this.interfaces) {
    // this.socketMostClient.sendControlMessage()
    console.log('subscribing to ', interfaceType)
    this.interfaces[interfaceType].allNotifcations()
    return new Promise((resolve) => {
      this.timeoutType = interfaceType
      this.subscriptionTimer = setTimeout(() => {
        console.log('subscription finished')
        this.timeoutType = ''
        resolve(true)
      }, 200)
    })
  }

  async changeSource(newSource: AvailableSources) {
    console.log('new source', newSource)
    await this.interfaces.SecAmplifier.functions[0x112].startResult([0x01])
    console.log('deallocate requesting')
    await this.disconnectSource()
    console.log('waiting for result')
    await this.waitForDealloc(this.currentSource)
    console.log('deallocated')
    console.log('allocating new')
    await this.allocateSource(newSource)
    console.log('allocated new')
    const data = await this.waitForAlloc(newSource)
    console.log('allocated', data)
    console.log('connecting')
    await this.interfaces.SecAmplifier.functions[0x111].startResult([
      0x01,
      data.srcDelay,
      ...data.channelList
    ])
  }

  async disconnectSource() {
    console.log('disconnecting')
    await this.interfaces[this.currentSource].functions[0x102].startResult([0x01])
  }

  waitForDealloc(source: AvailableSources) {
    return new Promise((resolve) => {
      this.interfaces[source].once('deallocResult', (source) => {
        console.log(`resolving deallocResult - ${source}`)
        resolve(true)
      })
    })
  }

  async allocateSource(source: AvailableSources) {
    console.log('running allocate')
    await this.interfaces[source].functions[0x101].startResult([0x01])
  }

  waitForAlloc(source: AvailableSources): Promise<{ srcDelay: number; channelList: number[] }> {
    return new Promise((resolve) => {
      this.interfaces[source].once('allocResult', (results) => {
        resolve(results)
      })
    })
  }
}
