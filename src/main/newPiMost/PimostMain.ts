import { SocketMostUsb } from 'socketmost'
import { Os8104Events } from 'socketmost'
import {
  AmFmTuner,
  Amplifier,
  AudioControl,
  AudioDiskPlayer,
  AuxInput,
  CanGateway,
  Carplay,
  Climate,
  DabTuner,
  Diagnostics,
  HMI,
  NetBlock,
  NetworkMaster,
  Satellite,
  Telephone,
  TvTuner
} from './FBlocks'
import winston from 'winston'
import { Socket } from '../Socket'
import { SubscriptionManager } from './SubscriptionManager'

export class PimostMain {
  socketmost: SocketMostUsb
  netblock: NetBlock
  hmi: HMI
  auxInput: AuxInput
  audioDiskPlayer: AudioDiskPlayer
  carplay: Carplay
  telephone: Telephone
  tvTuner: TvTuner
  satellite: Satellite
  dabTuner: DabTuner
  amFmTuner: AmFmTuner
  diagnostics: Diagnostics
  audioControl: AudioControl
  amplifier: Amplifier
  canGateway: CanGateway
  networkMaster: NetworkMaster
  climate: Climate
  logger: winston.Logger
  socket: Socket
  subscriptionManager: SubscriptionManager
  constructor(socket: Socket) {
    this.socket = socket
    this.logger = winston.loggers.get('pimost')
    this.logger.debug('pimost starting')
    this.socketmost = new SocketMostUsb()
    this.subscriptionManager = new SubscriptionManager(this.socketmost)
    this.networkMaster = new NetworkMaster(
      [],
      this.socketmost,
      false,
      socket,
      this.subscriptionManager
    )
    this.netblock = new NetBlock([], this.socketmost, false, socket, this.subscriptionManager)
    this.hmi = new HMI([], this.socketmost, false, socket, this.subscriptionManager)
    this.auxInput = new AuxInput([], this.socketmost, false, socket, this.subscriptionManager)
    this.audioDiskPlayer = new AudioDiskPlayer(
      [],
      this.socketmost,
      true,
      socket,
      this.subscriptionManager
    )
    this.carplay = new Carplay([], this.socketmost, false, socket, this.subscriptionManager)
    this.telephone = new Telephone([], this.socketmost, false, socket, this.subscriptionManager)
    this.tvTuner = new TvTuner([], this.socketmost, false, socket, this.subscriptionManager)
    this.satellite = new Satellite([], this.socketmost, false, socket, this.subscriptionManager)
    this.dabTuner = new DabTuner([], this.socketmost, true, socket, this.subscriptionManager)
    this.amFmTuner = new AmFmTuner([], this.socketmost, true, socket, this.subscriptionManager)
    this.diagnostics = new Diagnostics([], this.socketmost, false, socket, this.subscriptionManager)
    this.climate = new Climate([], this.socketmost, true, socket, this.subscriptionManager)
    this.audioControl = new AudioControl(
      [],
      this.socketmost,
      true,
      socket,
      this.subscriptionManager
    )
    this.amplifier = new Amplifier([], this.socketmost, true, socket, this.subscriptionManager)
    this.canGateway = new CanGateway(
      [],
      this.socketmost,
      true,
      socket,
      this.subscriptionManager,
      this.networkMaster
    )

    this.socket.on('newConnection', () => {
      this.socket.sendStatusUpdate('AmFmTuner', this.amFmTuner.status)
      this.socket.sendStatusUpdate('AudioDiskPlayer', this.audioDiskPlayer.status)
      this.socket.sendStatusUpdate('AudioControl', this.audioControl.status)
      this.socket.sendStatusUpdate('HMI', this.hmi.status)
    })

    this.socketmost.on('opened', () => {
      this.logger.info('socket most connected')
    })

    this.socketmost.on(Os8104Events.MessageSent, (data) => {
      console.log(data)
      this.logger.info('message sent' + data)
    })

    this.socket.on('button', (data) => {
      this.logger.info('button received ' + JSON.stringify(data))
      if ('args' in data) {
        this[data['device']][data['function']](data['args'])
      } else {
        this[data['device']][data['function']]()
      }
    })

    this.socket.on('setSource', (data) => {
      console.log('SWITCHING - ' + data)
      switch (data) {
        case 'AudioDiskPlayer':
          if (!(this.audioControl.currentSource instanceof AudioDiskPlayer)) {
            this.audioControl.switchSource(this.audioDiskPlayer)
          }
          break
        case 'AmFmTuner':
          this.logger.info(typeof this.audioControl.currentSource)
          if (!(this.audioControl.currentSource instanceof AmFmTuner)) {
            this.audioControl.switchSource(this.amFmTuner)
          } else {
            this.logger.info('AMFmTuner not connected')
          }
          break
      }
    })

    this.hmi.on('HMIShutdown', () => {
      this.audioControl.stopPlayback()
    })

    // this.hmi.on('HMIActive', () => {
    //   setTimeout(() => this.audioControl.startVolumeUpdates(), 500)
    // })

    this.socketmost.on(Os8104Events.SocketMostMessageRxEvent, (message) => {
      //this.logger.info(`message received ${this.convertMessageToHex(message)}`)
      switch (message.fBlockID) {
        case 0x01:
          this.logger.info('sending fblock')
          this.netblock.checkMessage(message)
          break
        case 0x10:
          this.hmi.checkMessage(message)
          break
        // case 0x24:
        //   this.auxInput.checkMessage(message)
        //   break
        case 0x31:
          if (message.instanceID === 0xa1 || message.instanceID === 0x2) {
            this.audioDiskPlayer.checkMessage(message)
          } else {
            this.carplay.checkMessage(message)
          }
          break
        case 0x50:
          this.telephone.checkMessage(message)
          break
        case 0x42:
          this.tvTuner.checkMessage(message)
          break
        case 0x44:
          this.satellite.checkMessage(message)
          break
        case 0x43:
          this.dabTuner.checkMessage(message)
          break
        case 0x40:
          this.amFmTuner.checkMessage(message)
          break
        case 0x06:
          this.diagnostics.checkMessage(message)
          break
        case 0xf0:
          this.audioControl.checkMessage(message)
          break
        case 0x22:
          this.amplifier.checkMessage(message)
          break
        case 0x02:
          this.networkMaster.checkMessage(message)
          break
        case 0xf5:
          this.canGateway.checkMessage(message)
          break
        case 0x71:
          this.climate.checkMessage(message)
          break
        default:
          this.logger.error('unhandled fblock: ' + this.convertMessageToHex(message))
      }
    })

    // setTimeout(() => {
    //   this.logger.info('beginning switchcdplayer')
    //   this.audioControl.switchSource(this.audioDiskPlayer)
    // }, 10000)
    //
    // setInterval(() => {
    //   this.logger.info('beginning switch amfm')
    //   this.audioControl.switchSource(this.amFmTuner)
    //   setTimeout(() => {
    //     this.logger.info('beginning switchcdplayer')
    //     this.audioControl.switchSource(this.audioDiskPlayer)
    //   }, 10000)
    // }, 20000)

    // setTimeout(() => {
    //   this.logger.info('beginning switch')
    //   this.audioControl.switchSource(this.audioDiskPlayer)
    //   // setTimeout(() => {
    //   //   this.logger.info('beginning switch2')
    //   //   this.audioControl.switchSource(this.audioDiskPlayer)
    //   // }, 10000)
    //   // setTimeout(() => {
    //   //   this.amFmTuner.autostore()
    //   // }, 5000)
    // }, 10000)
  }

  convertMessageToHex(message) {
    // TODO: Include telLen in persisted MOST diagnostics logs so an empty payload can be
    // distinguished from a one-byte payload containing 0x00.
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
