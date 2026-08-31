import { SocketMostUsb } from 'socketmost'
import { Os8104Events } from 'socketmost'
import {
  AmFmTuner,
  Amplifier,
  AudioControl,
  AudioDiskPlayer,
  AuxInput,
  CanGateway,
  Climate,
  Carplay,
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
import { ExtraConfig } from '../Globals'
import { MostRxMessage, SocketMostSendMessage, UsbSettings } from 'socketmost/dist/modules/Messages'
import { app, shell } from 'electron'
import { createWriteStream, mkdirSync, WriteStream } from 'fs'
import { readFile, readdir, stat } from 'fs/promises'
import { basename, join } from 'path'

type DiagnosticDevice = {
  address: number
  fBlockID: number
  instanceID: number
}

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
  climate: Climate
  networkMaster: NetworkMaster
  logger: winston.Logger
  socket: Socket
  registryData: number[] = []
  registrySequence = -1
  functionListData: number[] = []
  functionListSequence = -1
  functionListDevice: DiagnosticDevice | null = null
  diagnosticsLog: WriteStream | null = null
  diagnosticsLogPath: string | null = null
  headUnitMode: boolean
  sourceCycleQueue: Promise<void> = Promise.resolve()
  constructor(socket: Socket) {
    this.socket = socket
    this.headUnitMode = !socket.config.diagnosticMode
    this.logger = winston.loggers.get('pimost')
    this.logger.debug('pimost starting')
    this.socketmost = new SocketMostUsb()
    this.installDiagnosticsTransmitTap()
    this.netblock = new NetBlock([], this.socketmost, false, socket)
    this.hmi = new HMI([], this.socketmost, false, socket)
    this.auxInput = new AuxInput([], this.socketmost, false, socket)
    this.audioDiskPlayer = new AudioDiskPlayer([], this.socketmost, false, socket)
    this.carplay = new Carplay([], this.socketmost, false, socket)
    this.telephone = new Telephone([], this.socketmost, false, socket)
    this.tvTuner = new TvTuner([], this.socketmost, false, socket)
    this.satellite = new Satellite([], this.socketmost, false, socket)
    this.dabTuner = new DabTuner([], this.socketmost, false, socket)
    this.amFmTuner = new AmFmTuner([], this.socketmost, false, socket)
    this.diagnostics = new Diagnostics([], this.socketmost, false, socket)
    this.audioControl = new AudioControl([], this.socketmost, false, socket)
    this.amplifier = new Amplifier([], this.socketmost, false, socket)
    this.canGateway = new CanGateway([], this.socketmost, true, socket)
    this.climate = new Climate([], this.socketmost, false, socket)
    this.networkMaster = new NetworkMaster([], this.socketmost, false, socket)

    this.socket.on('newConnection', () => {
      this.sendOperatingMode()
      if (this.headUnitMode !== true) return
      this.socket.sendStatusUpdate('AmFmTuner', this.amFmTuner.status)
      this.socket.sendStatusUpdate('AudioDiskPlayer', this.audioDiskPlayer.status)
      this.socket.sendStatusUpdate('AudioControl', this.audioControl.status)
      this.socket.sendStatusUpdate('HMI', this.hmi.status)
      this.socket.sendStatusUpdate('Climate', this.climate.status)
      this.socket.sendStatusUpdate('CanGateway', this.canGateway.status)
      this.socket.sendStatusUpdate('Amplifier', this.amplifier.status)
    })

    this.socketmost.on('opened', () => {
      this.logger.info('socket most connected')
    })

    this.socketmost.on(Os8104Events.Settings, (settings: UsbSettings) => {
      this.socket.sendMostSettings(settings)
    })

    this.socket.on('appSettings', (settings: ExtraConfig) => {
      const wasHeadUnit = this.headUnitMode
      this.headUnitMode = !settings.diagnosticMode
      if (wasHeadUnit && !this.headUnitMode) this.audioControl.currentSource = null
      this.logger.info(this.headUnitMode ? 'Head-unit mode enabled' : 'Diagnostics-only mode enabled')
      this.sendOperatingMode()
    })

    this.socketmost.on(Os8104Events.MessageSent, (data) => {
      console.log(data)
      this.logger.info('message sent' + data)
    })

    this.socket.on('button', (data) => {
      if (this.headUnitMode !== true) {
        this.logger.warn('Ignoring head-unit button action while in diagnostics-only mode')
        return
      }
      this.logger.info('button received ' + JSON.stringify(data))
      const device = this[data['device']]
      const action = device?.[data['function']]
      if (typeof action !== 'function') {
        this.logger.error(`unknown button action ${data['device']}.${data['function']}`)
        return
      }
      if ('args' in data) {
        action.call(device, data['args'])
      } else {
        action.call(device)
      }
    })

    this.socket.on('setSource', async (data) => {
      if (this.headUnitMode !== true) {
        this.logger.warn('Ignoring source switch while in diagnostics-only mode')
        return
      }
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
        case 'Carplay':
        case 'carplay':
          if (!(this.audioControl.currentSource instanceof Carplay)) {
            const advertised = await this.waitForCarplayAdvertisement()
            if (!advertised) {
              this.logger.error('CarPlay source switch aborted because its FBlock was not advertised')
              break
            }
            this.audioControl.switchSource(this.carplay)
          } else {
            this.logger.info('CarPlay is already the current source')
          }
          break
      }
    })

    this.socket.on('mostDiagnostics:requestRegistry', () => this.requestRegistry())
    this.socket.on('mostDiagnostics:subscribe', (device: DiagnosticDevice) => {
      this.subscribeToDevice(device)
    })
    this.socket.on('mostDiagnostics:requestFunctions', (device: DiagnosticDevice) => {
      this.requestFunctions(device)
    })
    this.socket.on('mostDiagnostics:subscribeFunctions', (request) => {
      this.subscribeToFunctions(request?.device, request?.functions)
    })
    this.socket.on('mostDiagnostics:send', (message: SocketMostSendMessage) => {
      this.sendManualMessage(message)
    })
    this.socket.on('mostDiagnostics:setLogging', (enabled: boolean) => {
      this.setDiagnosticsLogging(enabled)
    })
    this.socket.on('mostUsb:getSettings', () => this.socketmost.getSettings())
    this.socket.on('mostUsb:saveSettings', (settings: UsbSettings) => {
      this.saveUsbSettings(settings)
    })
    this.socket.on('mostUsb:bootToDfu', () => this.bootToDfu())
    this.socket.on('mostLogs:list', (callback) => this.listDiagnosticLogs(callback))
    this.socket.on('mostLogs:read', ({ fileName, callback }) =>
      this.readDiagnosticLog(fileName, callback)
    )

    this.hmi.on('HMIShutdown', () => {
      if (this.headUnitMode !== true) return
      this.audioControl.stopPlayback()
    })

    this.hmi.on('HMIActive', () => {
      if (this.headUnitMode !== true) return
      setTimeout(() => {
        if (this.headUnitMode !== true) return
        this.audioControl.startVolumeUpdates()
        setTimeout(() => {
          if (this.headUnitMode !== true) return
          this.amplifier.startUpdates()
          this.climate.startUpdates()
          setTimeout(() => {
            if (this.headUnitMode === true) this.canGateway.startUpdates()
          }, 100)
        }, 100)
      }, 500)
    })

    this.hmi.on('skipForward', () => this.skipCurrentSource(true))
    this.hmi.on('skipBackward', () => this.skipCurrentSource(false))
    this.hmi.on('cycleSource', () => {
      this.sourceCycleQueue = this.sourceCycleQueue.then(() => this.cycleSource()).catch((error) => {
        this.logger.error(`Source button cycle failed: ${error instanceof Error ? error.message : String(error)}`)
      })
    })
    this.hmi.on('musicSettings', () => {
      this.socket.sendStatusUpdate('HMICommand', { type: 'navigate', path: '/settings/audio' })
    })

    this.socketmost.on(Os8104Events.SocketMostMessageRxEvent, (message) => {
      this.publishDiagnosticMessage(this.toDiagnosticMessage(message, 'rx'))
      this.captureRegistry(message)
      this.captureFunctionList(message)
      this.logger.info(`message received ${this.convertMessageToHex(message)}`)
      if (this.headUnitMode !== true) return
      switch (message.fBlockID) {
        case 0x01:
          this.logger.info('sending fblock')
          this.netblock.checkMessage(message)
          break
        case 0x10:
          this.hmi.checkMessage(message)
          break
        case 0x24:
          this.auxInput.checkMessage(message)
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
        case 0x71:
          this.climate.checkMessage(message)
          break
        case 0x02:
          this.networkMaster.checkMessage(message)
          break
        case 0xf5:
          this.canGateway.checkMessage(message)
          break
        // case 0xf0:
        //   this.canGateway.checkMessage(message)
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

  requestRegistry() {
    this.registryData = []
    this.registrySequence = -1
    this.sendDiagnosticControlMessage({
      targetAddressHigh: 0x04,
      targetAddressLow: 0x00,
      fBlockID: 0x02,
      instanceID: 0x00,
      fktID: 0x0a01,
      opType: 0x01,
      data: []
    })
  }

  skipCurrentSource(forward: boolean) {
    if (this.headUnitMode !== true) return
    if (this.audioControl.currentSource instanceof AudioDiskPlayer) {
      forward ? this.audioDiskPlayer.nextTrack() : this.audioDiskPlayer.prevTrack()
    } else if (this.audioControl.currentSource instanceof AmFmTuner) {
      forward ? this.amFmTuner.seekForward() : this.amFmTuner.seekBack()
    } else if (this.audioControl.currentSource instanceof Carplay) {
      this.socket.sendStatusUpdate('HMICommand', { type: 'carplay', command: forward ? 'next' : 'prev' })
    } else {
      this.logger.info('Ignoring skip button because no supported source is active')
    }
  }

  async cycleSource(): Promise<void> {
    if (this.headUnitMode !== true) return
    const sources = [this.amFmTuner, this.audioDiskPlayer, this.carplay]
    const currentIndex = sources.findIndex((source) => source === this.audioControl.currentSource)
    const nextSource = sources[(currentIndex + 1) % sources.length]
    if (nextSource instanceof Carplay && !(await this.waitForCarplayAdvertisement())) {
      this.logger.warn('Skipping unavailable CarPlay source')
      await this.audioControl.switchSource(this.amFmTuner)
      return
    }
    await this.audioControl.switchSource(nextSource)
  }

  sendOperatingMode() {
    this.socket.sendStatusUpdate('mostOperatingMode', {
      headUnit: this.headUnitMode === true,
      known: true,
      nodeAddress: this.socketmost.settings
        ? (this.socketmost.settings.nodeAddressHigh << 8) | this.socketmost.settings.nodeAddressLow
        : null
    })
  }

  subscribeToDevice(device: DiagnosticDevice) {
    if (!device || !Number.isInteger(device.address) || !Number.isInteger(device.fBlockID)) return
    const settings = this.socketmost.settings
    if (!settings) {
      this.logger.warn('MOST diagnostics subscription requested before USB settings were ready')
      return
    }
    this.sendDiagnosticControlMessage({
      targetAddressHigh: (device.address >> 8) & 0xff,
      targetAddressLow: device.address & 0xff,
      fBlockID: device.fBlockID,
      instanceID: device.instanceID,
      fktID: 0x001,
      opType: 0x00,
      data: [0x00, settings.nodeAddressHigh, settings.nodeAddressLow]
    })
    this.socket.setMostSubscription(
      `diagnostics:${device.address}:${device.fBlockID}:${device.instanceID}`,
      {
        owner: 'MOST diagnostics',
        ...device,
        functions: [],
        all: true
      }
    )
  }

  requestFunctions(device: DiagnosticDevice) {
    if (!this.validDiagnosticDevice(device)) return
    this.functionListDevice = { ...device }
    this.functionListData = []
    this.functionListSequence = -1
    this.sendDiagnosticControlMessage({
      targetAddressHigh: (device.address >> 8) & 0xff,
      targetAddressLow: device.address & 0xff,
      fBlockID: device.fBlockID,
      instanceID: device.instanceID,
      fktID: 0x000,
      opType: 0x01,
      data: []
    })
  }

  subscribeToFunctions(device: DiagnosticDevice, functions: number[]) {
    if (!this.validDiagnosticDevice(device) || !Array.isArray(functions)) return
    const selected = Array.from(new Set(functions)).filter(
      (value) => Number.isInteger(value) && value >= 0 && value <= 0xff
    )
    if (!selected.length) return
    const settings = this.socketmost.settings
    if (!settings) {
      this.logger.warn('MOST diagnostics function subscription requested before USB settings were ready')
      return
    }
    for (let index = 0; index < selected.length; index += 4) {
      this.sendDiagnosticControlMessage({
        targetAddressHigh: (device.address >> 8) & 0xff,
        targetAddressLow: device.address & 0xff,
        fBlockID: device.fBlockID,
        instanceID: device.instanceID,
        fktID: 0x001,
        opType: 0x00,
        data: [
          0x01,
          settings.nodeAddressHigh,
          settings.nodeAddressLow,
          ...selected.slice(index, index + 4)
        ]
      })
    }
    this.socket.setMostSubscription(
      `diagnostics:${device.address}:${device.fBlockID}:${device.instanceID}`,
      { owner: 'MOST diagnostics', ...device, functions: selected, all: false }
    )
  }

  validDiagnosticDevice(device: DiagnosticDevice) {
    return Boolean(
      device &&
      Number.isInteger(device.address) && device.address >= 0 && device.address <= 0xffff &&
      Number.isInteger(device.fBlockID) && device.fBlockID >= 0 && device.fBlockID <= 0xff &&
      Number.isInteger(device.instanceID) && device.instanceID >= 0 && device.instanceID <= 0xff
    )
  }

  sendManualMessage(message: SocketMostSendMessage) {
    const numericFields = [
      'targetAddressHigh',
      'targetAddressLow',
      'fBlockID',
      'instanceID',
      'fktID',
      'opType'
    ]
    if (!message || numericFields.some((field) => !Number.isInteger(message[field]))) {
      this.logger.warn('Rejected invalid manual MOST message')
      return
    }
    const data = Array.isArray(message.data) ? message.data : Array.from(message.data || [])
    if (data.some((byte) => !Number.isInteger(byte) || byte < 0 || byte > 0xff)) {
      this.logger.warn('Rejected manual MOST message with invalid data')
      return
    }
    this.sendDiagnosticControlMessage({ ...message, data })
  }

  sendDiagnosticControlMessage(message: SocketMostSendMessage) {
    this.socketmost.sendControlMessage(message)
  }

  installDiagnosticsTransmitTap() {
    const originalSend = this.socketmost.sendControlMessage.bind(this.socketmost)
    const socketmost = this.socketmost as SocketMostUsb & {
      sendControlMessage: (message: SocketMostSendMessage, telID?: number) => void
    }
    socketmost.sendControlMessage = (message: SocketMostSendMessage, telID?: number) => {
      // Multipart fragments call sendControlMessage with a telID internally. Log the
      // original logical message once, rather than every transport fragment.
      if (telID === undefined) {
        this.publishDiagnosticMessage(this.toDiagnosticMessage(message, 'tx'))
      }
      originalSend(message, telID)
    }
  }

  publishDiagnosticMessage(message) {
    this.socket.sendDiagnosticsMessage(message)
    this.diagnosticsLog?.write(`${JSON.stringify(this.formatDiagnosticLogMessage(message))}\n`)
  }

  formatDiagnosticLogMessage(message) {
    const hex = (value: number | undefined, width: number) =>
      value === undefined ? undefined : `0x${value.toString(16).toUpperCase().padStart(width, '0')}`
    return {
      direction: message.direction,
      timestamp: new Date(message.timestamp).toISOString(),
      sourceAddress: hex(message.sourceAddress, 4),
      targetAddress: hex(message.targetAddress, 4),
      fBlockID: hex(message.fBlockID, 2),
      instanceID: hex(message.instanceID, 2),
      fktID: hex(message.fktID, 3),
      opType: hex(message.opType, 2),
      telID: hex(message.telID, 2),
      data: (message.data || []).map((byte) => hex(byte, 2))
    }
  }

  setDiagnosticsLogging(enabled: boolean) {
    if (!enabled) {
      const completedLog = this.diagnosticsLogPath
      this.diagnosticsLog?.end(() => {
        if (!completedLog) return
        shell.openPath(completedLog).then((error) => {
          if (error) this.logger.error(`Could not open MOST diagnostics log: ${error}`)
        })
      })
      this.diagnosticsLog = null
      this.socket.sendDiagnosticsLogging({ enabled: false, path: this.diagnosticsLogPath })
      return
    }
    if (this.diagnosticsLog) return
    const directory = this.diagnosticLogDirectory()
    mkdirSync(directory, { recursive: true })
    const stamp = new Date().toISOString().replace(/[:.]/g, '-')
    this.diagnosticsLogPath = join(directory, `most-diagnostics-${stamp}.jsonl`)
    this.diagnosticsLog = createWriteStream(this.diagnosticsLogPath, { flags: 'a' })
    this.diagnosticsLog.on('error', (error) => {
      this.logger.error(`MOST diagnostics log failed: ${error.message}`)
      this.diagnosticsLog = null
      this.socket.sendDiagnosticsLogging({
        enabled: false,
        path: this.diagnosticsLogPath,
        error: error.message
      })
    })
    this.socket.sendDiagnosticsLogging({ enabled: true, path: this.diagnosticsLogPath })
  }

  saveUsbSettings(settings: UsbSettings) {
    const byteFields = ['nodeAddressHigh', 'nodeAddressLow', 'groupAddress']
    if (
      !settings ||
      byteFields.some(
        (field) =>
          !Number.isInteger(settings[field]) || settings[field] < 0 || settings[field] > 0xff
      )
    ) {
      this.logger.warn('Rejected invalid PiMOST USB settings')
      return
    }
    this.logger.info('Saving PiMOST USB settings')
    this.socketmost.saveSettings(settings)
    setTimeout(() => this.socketmost.getSettings(), 350)
  }

  bootToDfu() {
    if (!this.socketmost.port?.isOpen) {
      this.logger.error('Cannot enter DFU mode because the PiMOST USB interface is not connected')
      return
    }
    this.logger.warn('Rebooting PiMOST USB into DFU mode')
    this.socketmost.port.write(Buffer.from([0x55, 0x01, 0x63]))
  }

  waitForCarplayAdvertisement(): Promise<boolean> {
    if (this.netblock.fblocksAdvertised) return Promise.resolve(true)

    this.logger.info('waiting for the CarPlay FBlock to be advertised')
    return new Promise((resolve) => {
      const finish = (advertised: boolean) => {
        clearTimeout(timeout)
        this.netblock.removeListener('fblocksAdvertised', onAdvertised)
        resolve(advertised)
      }
      const onAdvertised = () => finish(true)
      const timeout = setTimeout(() => finish(false), 5000)
      this.netblock.once('fblocksAdvertised', onAdvertised)
    })
  }

  diagnosticLogDirectory() {
    return join(app.getPath('documents'), 'JLR-HU', 'MOST logs')
  }

  async listDiagnosticLogs(callback) {
    try {
      const directory = this.diagnosticLogDirectory()
      mkdirSync(directory, { recursive: true })
      const names = (await readdir(directory)).filter((name) => name.endsWith('.jsonl'))
      const files = await Promise.all(
        names.map(async (name) => {
          const details = await stat(join(directory, name))
          return { name, size: details.size, modified: details.mtime.toISOString() }
        })
      )
      callback({ files: files.sort((a, b) => b.modified.localeCompare(a.modified)) })
    } catch (error) {
      callback({ files: [], error: error instanceof Error ? error.message : String(error) })
    }
  }

  async readDiagnosticLog(fileName: string, callback) {
    try {
      const safeName = basename(fileName)
      if (safeName !== fileName || !safeName.endsWith('.jsonl')) throw new Error('Invalid log file')
      const contents = await readFile(join(this.diagnosticLogDirectory(), safeName), 'utf8')
      const messages = contents
        .split(/\r?\n/)
        .filter(Boolean)
        .map((line, index) => {
          try {
            return JSON.parse(line)
          } catch {
            return { direction: 'error', data: [line], line: index + 1 }
          }
        })
      callback({ name: safeName, messages })
    } catch (error) {
      callback({
        name: fileName,
        messages: [],
        error: error instanceof Error ? error.message : String(error)
      })
    }
  }

  toDiagnosticMessage(message, direction: 'rx' | 'tx') {
    return {
      direction,
      timestamp: Date.now(),
      sourceAddress:
        direction === 'rx'
          ? ((message.sourceAddrHigh || 0) << 8) | (message.sourceAddrLow || 0)
          : undefined,
      targetAddress:
        direction === 'tx'
          ? ((message.targetAddressHigh || 0) << 8) | (message.targetAddressLow || 0)
          : undefined,
      fBlockID: message.fBlockID,
      instanceID: message.instanceID,
      fktID: message.fktID,
      opType: message.opType,
      telID: message.telID,
      data: Array.from(message.data || [])
    }
  }

  captureRegistry(message: MostRxMessage) {
    if (message.fBlockID !== 0x02 || message.fktID !== 0x0a01) return
    const bytes = Array.from(message.data.subarray(0, message.telLen))
    if (message.telID === 0x01) {
      this.registrySequence = bytes[0]
      this.registryData = bytes.slice(1)
      return
    }
    if (message.telID === 0x02 || message.telID === 0x03) {
      if (bytes[0] !== this.registrySequence + 1) {
        this.registryData = []
        this.registrySequence = -1
        return
      }
      this.registrySequence = bytes[0]
      this.registryData.push(...bytes.slice(1))
      if (message.telID !== 0x03) return
    } else {
      this.registryData = bytes
    }

    const registry: DiagnosticDevice[] = []
    for (let index = 0; index + 3 < this.registryData.length; index += 4) {
      registry.push({
        address: (this.registryData[index] << 8) | this.registryData[index + 1],
        fBlockID: this.registryData[index + 2],
        instanceID: this.registryData[index + 3]
      })
    }
    this.socket.sendDiagnosticsRegistry(registry)
    this.registryData = []
    this.registrySequence = -1
  }

  captureFunctionList(message: MostRxMessage) {
    const device = this.functionListDevice
    const sourceAddress = ((message.sourceAddrHigh || 0) << 8) | (message.sourceAddrLow || 0)
    if (
      !device ||
      message.fktID !== 0x000 ||
      message.fBlockID !== device.fBlockID ||
      message.instanceID !== device.instanceID ||
      sourceAddress !== device.address
    ) return

    const bytes = Array.from(message.data.subarray(0, message.telLen))
    if (message.telID === 0x01) {
      this.functionListSequence = bytes[0]
      this.functionListData = bytes.slice(1)
      return
    }
    if (message.telID === 0x02 || message.telID === 0x03) {
      if (bytes[0] !== this.functionListSequence + 1) {
        this.functionListData = []
        this.functionListSequence = -1
        this.socket.sendDiagnosticsFunctions(device, [], 'Function-list sequence error')
        return
      }
      this.functionListSequence = bytes[0]
      this.functionListData.push(...bytes.slice(1))
      if (message.telID !== 0x03) return
    } else {
      this.functionListData = bytes
    }

    const boundaries: number[] = []
    for (let index = 0; index + 1 < this.functionListData.length; index += 3) {
      boundaries.push(
        ((this.functionListData[index] << 4) | (this.functionListData[index + 1] >> 4)) & 0xfff
      )
      if (index + 2 < this.functionListData.length) {
        boundaries.push(
          (((this.functionListData[index + 1] & 0x0f) << 8) |
            this.functionListData[index + 2]) & 0xfff
        )
      }
    }
    if (boundaries[boundaries.length - 1] === 0) boundaries.pop()
    const functions: number[] = []
    let enabled = true
    for (let id = 0; id < 0x1000; id += 1) {
      if (boundaries.includes(id)) enabled = !enabled
      if (enabled) functions.push(id)
    }
    this.socket.sendDiagnosticsFunctions(device, functions)
    this.functionListData = []
    this.functionListSequence = -1
  }

  convertMessageToHex(message) {
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
