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
  TvTuner,
  Vehicle
} from './FBlocks'
import winston from 'winston'
import { Socket } from '../Socket'
import { SubscriptionManager } from './SubscriptionManager'
import { MostDiagnosticsBackend } from './MostDiagnosticsBackend'
import { PiMostFirmwareBackend } from './PiMostFirmwareBackend'
import { ExtraConfig } from '../Globals'
import { UsbSettings } from 'socketmost'
import { getLogger } from '../log'
import { SystemInfo, SystemInfoSnapshot } from '../SystemInfo'

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
  vehicle: Vehicle
  logger: winston.Logger
  socket: Socket
  subscriptionManager: SubscriptionManager
  mostDiagnostics: MostDiagnosticsBackend
  piMostFirmware: PiMostFirmwareBackend
  headUnitMode: boolean
  sourceCycleQueue: Promise<void> = Promise.resolve()
  lastStandardButton: { action: 'home' | 'power'; timestamp: number } | null = null
  private systemStatus: SystemInfoSnapshot | null = null
  private mostTime: { hours: number; minutes: number } | null = null
  private lastClockSync = 0
  constructor(socket: Socket, systemInfo?: SystemInfo) {
    this.socket = socket
    this.headUnitMode = !Boolean(
      (socket.config as ExtraConfig & { diagnosticMode?: boolean }).diagnosticMode
    )
    this.logger = getLogger('PimostMain')
    this.logger.debug('pimost starting')
    this.socketmost = new SocketMostUsb()
    this.subscriptionManager = new SubscriptionManager(this.socketmost)
    this.subscriptionManager.on('failed', (subscription) => {
      this.socket.sendAppAlert({
        title: 'Subscription failed',
        message: `${subscription.owner || 'Application'} · FBlock 0x${subscription.fBlockID
          .toString(16)
          .toUpperCase()} instance 0x${subscription.instanceID.toString(16).toUpperCase()}`,
        severity: 'warning'
      })
    })
    this.mostDiagnostics = new MostDiagnosticsBackend(
      this.socketmost,
      socket,
      this.subscriptionManager
    )
    this.piMostFirmware = new PiMostFirmwareBackend(this.socketmost, socket)
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
      false,
      socket,
      this.subscriptionManager
    )
    this.carplay = new Carplay([], this.socketmost, false, socket, this.subscriptionManager)
    this.telephone = new Telephone([], this.socketmost, false, socket, this.subscriptionManager)
    this.tvTuner = new TvTuner([], this.socketmost, false, socket, this.subscriptionManager)
    this.satellite = new Satellite([], this.socketmost, false, socket, this.subscriptionManager)
    this.dabTuner = new DabTuner([], this.socketmost, false, socket, this.subscriptionManager)
    this.amFmTuner = new AmFmTuner([], this.socketmost, false, socket, this.subscriptionManager)
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
    this.vehicle = new Vehicle([], this.socketmost, false, socket, this.subscriptionManager)
    this.canGateway = new CanGateway(
      [],
      this.socketmost,
      true,
      socket,
      this.subscriptionManager,
      this.networkMaster
    )

    systemInfo?.on('status', (status: SystemInfoSnapshot) => {
      this.systemStatus = status
      this.synchroniseMostClock()
    })
    this.canGateway.on('clockStatus', (time: { hours: number; minutes: number }) => {
      this.mostTime = time
      this.synchroniseMostClock()
    })
    // this.networkMaster.on('ClimateAvailable', () => this.climate.subscribe())
    // this.networkMaster.on('AmplifierAvailable', () => this.amplifier.subscribe())

    this.socket.on('newConnection', () => {
      this.socket.sendStatusUpdate('AmFmTuner', this.amFmTuner.status)
      this.socket.sendStatusUpdate('DabTuner', this.dabTuner.status)
      this.socket.sendStatusUpdate('AudioDiskPlayer', this.audioDiskPlayer.status)
      this.socket.sendStatusUpdate('AudioControl', this.audioControl.status)
      this.socket.sendStatusUpdate('HMI', this.hmi.status)
      this.socket.sendStatusUpdate('Climate', this.climate.status)
      this.socket.sendStatusUpdate('CanGateway', this.canGateway.status)
      this.socket.sendStatusUpdate('Amplifier', this.amplifier.status)
      this.sendOperatingMode()
    })

    this.socket.on('appSettings', (settings: ExtraConfig & { diagnosticMode?: boolean }) => {
      this.headUnitMode = !Boolean(settings.diagnosticMode)
      if (!this.headUnitMode) this.audioControl.currentSource = null
      this.sendOperatingMode()
    })

    this.socketmost.on('opened', () => {
      this.logger.info('socket most connected')
    })

    this.socketmost.on(Os8104Events.Settings, (settings: UsbSettings) => {
      this.socket.sendMostSettings(settings)
    })

    this.socket.on('mostUsb:getSettings', () => this.socketmost.getSettings())
    this.socket.on('mostUsb:saveSettings', (settings: UsbSettings) => {
      this.socketmost.saveSettings(settings)
      setTimeout(() => this.socketmost.getSettings(), 350)
    })

    this.socketmost.on(Os8104Events.MessageSent, (data) => {
      console.log(data)
      this.logger.info('message sent' + data)
    })

    this.socket.on('button', (data) => {
      if (!this.headUnitMode) return
      this.logger.info('button received ' + JSON.stringify(data))
      const device = this[data?.device]
      const action = device?.[data?.function]
      if (typeof action !== 'function') {
        this.logger.error(`unknown button action ${data?.device}.${data?.function}`)
        return
      }
      if ('args' in data) {
        action.call(device, data.args)
      } else {
        action.call(device)
      }
    })

    this.socket.on('setSource', async (data) => {
      if (!this.headUnitMode) return
      console.log('SWITCHING - ' + data)
      await this.activateSource(data)
    })

    this.hmi.on('HMIShutdown', () => {
      this.audioControl.stopPlayback()
    })

    this.hmi.on('skipForward', () => this.skipCurrentSource(true))
    this.hmi.on('skipBackward', () => this.skipCurrentSource(false))
    this.hmi.on('homeButton', () => this.handleStandardButton('home'))
    this.hmi.on('powerButton', () => this.handleStandardButton('power'))

    for (const source of [this.amFmTuner, this.dabTuner, this.audioDiskPlayer, this.carplay]) {
      source.on(
        'genericButton',
        (button: {
          action: 'skipForward' | 'skipBackward' | 'home' | 'power' | 'unassigned'
          press: 'short' | 'long'
          code?: number
        }) => {
          if (button.press === 'long') {
            const recentButton = this.lastStandardButton
            const isRecentPowerPress =
              recentButton?.action === 'power' && Date.now() - recentButton.timestamp < 2000

            // A held button reports progressive stages (0x03, then 0x04).
            // Quit only on the final stage and only when it follows Power.
            if (isRecentPowerPress && button.code === 0x04) {
              this.logger.info('HMI power button long pressed; closing application')
              this.lastStandardButton = null
              this.socket.emit('quitApplication')
              return
            }

            this.logger.info(
              `${source.constructor.name} long-press handler reserved` +
                (button.code === undefined ? '' : ` (0x${button.code.toString(16)})`)
            )
            return
          }

          if (button.action === 'skipForward') this.skipCurrentSource(true)
          else if (button.action === 'skipBackward') this.skipCurrentSource(false)
          else if (button.action === 'home' || button.action === 'power') {
            this.handleStandardButton(button.action)
          }
        }
      )
    }
    this.hmi.on('cycleSource', () => {
      this.sourceCycleQueue = this.sourceCycleQueue
        .then(() => this.cycleSource())
        .catch((error) =>
          this.logger.error(
            `Source cycle failed: ${error instanceof Error ? error.message : String(error)}`
          )
        )
    })
    this.hmi.on('musicSettings', () => {
      this.socket.sendStatusUpdate('HMICommand', { type: 'navigate', path: '/settings/audio' })
    })

    this.hmi.on('HMIActive', () => {
      setTimeout(() => this.audioControl.subscribe(), 500)
      setTimeout(() => this.canGateway.subscribe(), 500)
      setTimeout(() => this.climate.subscribe(), 500)
      setTimeout(() => {
        const lastSource = this.socket.config.lastSource
        if (lastSource && !this.audioControl.currentSource) {
          this.logger.info(`restoring last source ${lastSource}`)
          this.sourceCycleQueue = this.sourceCycleQueue
            .then(() => this.activateSource(lastSource))
            .catch((error) => {
              this.logger.error(
                `Last source restore failed: ${
                  error instanceof Error ? error.message : String(error)
                }`
              )
            })
        }
      }, 700)
    })

    this.socketmost.on(Os8104Events.SocketMostMessageRxEvent, (message) => {
      this.mostDiagnostics.observeRx(message)
      if (message.opType === 0x0f || message.opType === 0x09) {
        const errorCode = message.data?.length ? message.data.readUInt8(0) : null
        const errorNames: Record<number, string> = {
          0x01: 'FBlock not available',
          0x02: 'Instance not available',
          0x03: 'Function not available',
          0x04: 'Operation not available',
          0x05: 'Parameter error',
          0x06: 'Parameter unavailable'
        }
        this.socket.sendAppAlert({
          title: 'MOST request failed',
          message: `FBlock 0x${message.fBlockID
            .toString(16)
            .toUpperCase()} · function 0x${message.fktID.toString(16).toUpperCase()}${
            errorCode == null
              ? ''
              : ` · ${errorNames[errorCode] || `error 0x${errorCode.toString(16).toUpperCase()}`}`
          }`,
          severity: 'error'
        })
      }
      if (!this.headUnitMode) return
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
        case 0x05:
          this.vehicle.checkMessage(message)
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

  sendOperatingMode(): void {
    this.socket.sendStatusUpdate('mostOperatingMode', {
      headUnit: this.headUnitMode,
      known: true,
      nodeAddress: this.socketmost.settings
        ? (this.socketmost.settings.nodeAddressHigh << 8) | this.socketmost.settings.nodeAddressLow
        : null
    })
  }

  skipCurrentSource(forward: boolean): void {
    if (!this.headUnitMode) return
    if (this.audioControl.currentSource instanceof AudioDiskPlayer) {
      forward ? this.audioDiskPlayer.nextTrack() : this.audioDiskPlayer.prevTrack()
    } else if (this.audioControl.currentSource instanceof AmFmTuner) {
      forward ? this.amFmTuner.seekForward() : this.amFmTuner.seekBack()
    } else if (this.audioControl.currentSource instanceof Carplay) {
      this.socket.sendStatusUpdate('HMICommand', {
        type: 'carplay',
        command: forward ? 'next' : 'prev'
      })
    }
  }

  handleStandardButton(action: 'home' | 'power'): void {
    if (!this.headUnitMode) return
    this.lastStandardButton = { action, timestamp: Date.now() }
    this.socket.sendStatusUpdate('HMICommand', {
      type: action === 'home' ? 'homeToggle' : 'powerToggle'
    })
  }

  private async activateSource(source: unknown): Promise<void> {
    const sourceName = source === 'Carplay' ? 'carplay' : source
    let device: AudioDiskPlayer | AmFmTuner | DabTuner | Carplay | null = null

    if (sourceName === 'AudioDiskPlayer') device = this.audioDiskPlayer
    else if (sourceName === 'AmFmTuner') device = this.amFmTuner
    else if (sourceName === 'DabTuner') device = this.dabTuner
    else if (sourceName === 'carplay') device = this.carplay

    if (!device) {
      this.logger.warn(`Ignoring unknown source ${String(source)}`)
      return
    }

    if (this.audioControl.currentSource !== device) {
      await this.audioControl.switchSource(device)
      if (!(device instanceof Carplay)) device.subscribe()
    }
  }

  private synchroniseMostClock(): void {
    if (this.socket.config.autoTimeSync === false) return
    if (!this.systemStatus?.internetConnected || !this.mostTime) return

    const now = new Date()
    const systemMinutes = now.getHours() * 60 + now.getMinutes()
    const mostMinutes = this.mostTime.hours * 60 + this.mostTime.minutes
    const directDifference = Math.abs(systemMinutes - mostMinutes)
    const difference = Math.min(directDifference, 24 * 60 - directDifference)
    const desired24Hour = this.systemStatus.uses24HourClock
    const formatDiffers =
      (this.canGateway.status as Record<string, unknown>).uses24HourClock !== desired24Hour

    if (difference <= 1 && !formatDiffers) return
    if (Date.now() - this.lastClockSync < 60_000) return

    this.lastClockSync = Date.now()
    this.logger.info(
      `synchronising MOST clock ${this.mostTime.hours
        .toString()
        .padStart(2, '0')}:${this.mostTime.minutes.toString().padStart(2, '0')} -> ${now
        .getHours()
        .toString()
        .padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} (${
        desired24Hour ? '24-hour' : '12-hour'
      }, ${this.systemStatus.locale})`
    )
    this.canGateway.setClockFromSystem(now, desired24Hour, difference > 1)
  }

  async cycleSource(): Promise<void> {
    if (!this.headUnitMode) return
    const sources = [this.amFmTuner, this.dabTuner, this.audioDiskPlayer, this.carplay]
    const current = sources.indexOf(
      this.audioControl.currentSource as AmFmTuner | DabTuner | AudioDiskPlayer | Carplay
    )
    await this.audioControl.switchSource(sources[(current + 1) % sources.length])
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
