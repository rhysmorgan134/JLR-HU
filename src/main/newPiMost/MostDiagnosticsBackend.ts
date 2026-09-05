import { app, shell } from 'electron'
import { createWriteStream, mkdirSync, WriteStream } from 'fs'
import { join } from 'path'
import { MostRxMessage, SocketMostSendMessage, SocketMostUsb } from 'socketmost'
import winston from 'winston'
import { Socket } from '../Socket'
import { SubscriptionManager } from './SubscriptionManager'
import { SubscriptionRecord } from './types'
import { getLogger } from '../log'

type DiagnosticDevice = { address: number; fBlockID: number; instanceID: number }
type DiagnosticMessage = {
  direction: 'rx' | 'tx'
  timestamp: number
  sourceAddress?: number
  targetAddress?: number
  fBlockID: number
  instanceID: number
  fktID: number
  opType: number
  telID?: number
  telLen: number
  data: number[]
}

export class MostDiagnosticsBackend {
  private registryData: number[] = []
  private registrySequence = -1
  private functionData: number[] = []
  private functionSequence = -1
  private functionDevice: DiagnosticDevice | null = null
  private log: WriteStream | null = null
  private logPath: string | null = null
  private logger = getLogger('MostDiagnosticsBackend')
  private trafficLogger = getLogger('MostTraffic')

  constructor(
    private socketmost: SocketMostUsb,
    private socket: Socket,
    private subscriptions: SubscriptionManager
  ) {
    this.installTransmitTap()
    socket.on('mostDiagnostics:requestRegistry', () => this.requestRegistry())
    socket.on('mostDiagnostics:subscribe', (device: DiagnosticDevice) => this.subscribe(device, []))
    socket.on('mostDiagnostics:requestFunctions', (device: DiagnosticDevice) => this.requestFunctions(device))
    socket.on('mostDiagnostics:subscribeFunctions', (request) => this.subscribe(request?.device, request?.functions))
    socket.on('mostDiagnostics:send', (message: SocketMostSendMessage) => this.sendManual(message))
    socket.on('mostDiagnostics:setLogging', (enabled: boolean) => this.setLogging(enabled))
    subscriptions.on('changed', () => this.publishApplicationSubscriptions())
  }

  observeRx(message: MostRxMessage): void {
    const diagnosticMessage = this.toDiagnosticMessage(message, 'rx')
    this.trafficLogger.info(JSON.stringify(this.formatLogMessage(diagnosticMessage)))
    this.publish(diagnosticMessage)
    this.captureRegistry(message)
    this.captureFunctionList(message)
  }

  private requestRegistry(): void {
    this.registryData = []
    this.registrySequence = -1
    this.send({ targetAddressHigh: 0x04, targetAddressLow: 0x00, fBlockID: 0x02, instanceID: 0x00, fktID: 0xa01, opType: 0x01, data: [] })
  }

  private subscribe(device: DiagnosticDevice, requestedFunctions: unknown): void {
    if (!this.validDevice(device) || !this.socketmost.settings) return
    const functions = Array.isArray(requestedFunctions)
      ? Array.from(new Set<number>(requestedFunctions)).filter((value) => Number.isInteger(value) && value >= 0 && value <= 0xfff)
      : []
    if (functions.length === 0) {
      this.subscriptions.createSubscription(this.subscriptionRecord(device, []))
    } else {
      for (let index = 0; index < functions.length; index += 4) {
        this.subscriptions.createSubscription(
          this.subscriptionRecord(device, functions.slice(index, index + 4))
        )
      }
    }
  }

  private subscriptionRecord(device: DiagnosticDevice, functions: number[]): SubscriptionRecord {
    return {
      owner: 'MOST diagnostics',
      targetAddressHigh: (device.address >> 8) & 0xff,
      targetAddressLow: device.address & 0xff,
      sourceAddressHigh: this.socketmost.settings.nodeAddressHigh,
      sourceAddressLow: this.socketmost.settings.nodeAddressLow,
      fBlockID: device.fBlockID,
      instanceID: device.instanceID,
      subscriptionList: functions
    }
  }

  private requestFunctions(device: DiagnosticDevice): void {
    if (!this.validDevice(device)) return
    this.functionDevice = { ...device }
    this.functionData = []
    this.functionSequence = -1
    this.send({ targetAddressHigh: (device.address >> 8) & 0xff, targetAddressLow: device.address & 0xff, fBlockID: device.fBlockID, instanceID: device.instanceID, fktID: 0x000, opType: 0x01, data: [] })
  }

  private sendManual(message: SocketMostSendMessage): void {
    const fields: Array<keyof SocketMostSendMessage> = ['targetAddressHigh', 'targetAddressLow', 'fBlockID', 'instanceID', 'fktID', 'opType']
    if (!message || fields.some((field) => !Number.isInteger(message[field]))) {
      this.logger.warn('Rejected invalid manual MOST message')
      return
    }
    const data = Array.from(message.data || [])
    if (data.some((byte) => !Number.isInteger(byte) || byte < 0 || byte > 0xff)) {
      this.logger.warn('Rejected manual MOST message with invalid data bytes')
      return
    }
    this.send({ ...message, data })
  }

  private send(message: SocketMostSendMessage): void {
    this.socketmost.sendControlMessage(message)
  }

  private installTransmitTap(): void {
    const original = this.socketmost.sendControlMessage.bind(this.socketmost)
    const tapped = this.socketmost as SocketMostUsb & { sendControlMessage: (message: SocketMostSendMessage, telID?: number) => void }
    tapped.sendControlMessage = (message, telID) => {
      const diagnosticMessage = this.toDiagnosticMessage(message, 'tx')
      if (telID !== undefined) diagnosticMessage.telID = telID
      this.trafficLogger.info(JSON.stringify(this.formatLogMessage(diagnosticMessage)))
      if (telID === undefined) this.publish(this.toDiagnosticMessage(message, 'tx'))
      original(message, telID)
    }
  }

  private publish(message: DiagnosticMessage): void {
    this.socket.sendDiagnosticsMessage(message)
    this.log?.write(`${JSON.stringify(this.formatLogMessage(message))}\n`)
  }

  private setLogging(enabled: boolean): void {
    if (!enabled) {
      const completed = this.logPath
      this.log?.end(() => {
        if (completed) shell.openPath(completed).then((error) => error && this.logger.error(error))
      })
      this.log = null
      this.socket.sendDiagnosticsLogging({ enabled: false, path: completed })
      return
    }
    if (this.log) return
    const directory = join(app.getPath('documents'), 'JLR-HU', 'MOST logs')
    mkdirSync(directory, { recursive: true })
    this.logPath = join(directory, `most-diagnostics-${new Date().toISOString().replace(/[:.]/g, '-')}.jsonl`)
    this.log = createWriteStream(this.logPath, { flags: 'a' })
    this.log.on('error', (error) => {
      this.logger.error(`MOST diagnostics log failed: ${error.message}`)
      this.log = null
      this.socket.sendDiagnosticsLogging({ enabled: false, path: this.logPath, error: error.message })
    })
    this.socket.sendDiagnosticsLogging({ enabled: true, path: this.logPath })
  }

  private publishApplicationSubscriptions(): void {
    const records: Array<{ record: SubscriptionRecord; state: 'queued' | 'active' | 'failed' | 'in-progress' }> = [
      ...this.subscriptions.queuedSubscriptions.map((record) => ({ record, state: 'queued' as const })),
      ...this.subscriptions.activeSubscriptions.map((record) => ({ record, state: 'active' as const })),
      ...this.subscriptions.failedSubscriptions.map((record) => ({ record, state: 'failed' as const })),
      ...(this.subscriptions.inProgSubscription
        ? [{ record: this.subscriptions.inProgSubscription, state: 'in-progress' as const }]
        : [])
    ]

    this.socket.replaceApplicationSubscriptions(records.map(({ record, state }, index) => ({
      key: `application:${state}:${record.owner || 'Application'}:${record.targetAddressHigh}:${record.targetAddressLow}:${record.fBlockID}:${record.instanceID}:${record.subscriptionList.join(',')}:${index}`,
      value: {
        owner: record.owner || 'Application',
        state,
        address: (record.targetAddressHigh << 8) | record.targetAddressLow,
        fBlockID: record.fBlockID,
        instanceID: record.instanceID,
        functions: record.subscriptionList,
        all: record.subscriptionList.length === 0
      }
    })))
  }

  private captureRegistry(message: MostRxMessage): void {
    if (message.fBlockID !== 0x02 || message.fktID !== 0xa01) return
    const complete = this.collectRegistry(message)
    if (!complete) return
    const devices: DiagnosticDevice[] = []
    for (let index = 0; index + 3 < complete.length; index += 4) {
      devices.push({ address: (complete[index] << 8) | complete[index + 1], fBlockID: complete[index + 2], instanceID: complete[index + 3] })
    }
    this.socket.sendDiagnosticsRegistry(devices)
  }

  private captureFunctionList(message: MostRxMessage): void {
    const device = this.functionDevice
    const sourceAddress = (message.sourceAddrHigh << 8) | message.sourceAddrLow
    if (!device || message.fktID !== 0 || message.fBlockID !== device.fBlockID || message.instanceID !== device.instanceID || sourceAddress !== device.address) return
    const complete = this.collectFunctions(message)
    if (!complete) return
    const boundaries: number[] = []
    for (let index = 0; index + 1 < complete.length; index += 3) {
      boundaries.push(((complete[index] << 4) | (complete[index + 1] >> 4)) & 0xfff)
      if (index + 2 < complete.length) boundaries.push((((complete[index + 1] & 0x0f) << 8) | complete[index + 2]) & 0xfff)
    }
    if (boundaries[boundaries.length - 1] === 0) boundaries.pop()
    const functions: number[] = []
    let enabled = true
    for (let id = 0; id < 0x1000; id += 1) {
      if (boundaries.includes(id)) enabled = !enabled
      if (enabled) functions.push(id)
    }
    this.socket.sendDiagnosticsFunctions(device, functions)
    this.functionDevice = null
  }

  private collectRegistry(message: MostRxMessage): number[] | null {
    const result = this.collect(message, this.registryData, this.registrySequence)
    this.registryData = result.data
    this.registrySequence = result.sequence
    return result.complete
  }

  private collectFunctions(message: MostRxMessage): number[] | null {
    const result = this.collect(message, this.functionData, this.functionSequence)
    this.functionData = result.data
    this.functionSequence = result.sequence
    return result.complete
  }

  private collect(message: MostRxMessage, current: number[], sequence: number): { data: number[]; sequence: number; complete: number[] | null } {
    const bytes = Array.from(message.data.subarray(0, message.telLen))
    if (message.telID === 1) return { data: bytes.slice(1), sequence: bytes[0], complete: null }
    if (message.telID === 2 || message.telID === 3) {
      if (bytes[0] !== sequence + 1) return { data: [], sequence: -1, complete: null }
      const data = [...current, ...bytes.slice(1)]
      return message.telID === 3 ? { data: [], sequence: -1, complete: data } : { data, sequence: bytes[0], complete: null }
    }
    return { data: [], sequence: -1, complete: bytes }
  }

  private validDevice(device: DiagnosticDevice): boolean {
    return Boolean(device && Number.isInteger(device.address) && device.address >= 0 && device.address <= 0xffff && Number.isInteger(device.fBlockID) && device.fBlockID >= 0 && device.fBlockID <= 0xff && Number.isInteger(device.instanceID) && device.instanceID >= 0 && device.instanceID <= 0xff)
  }

  private toDiagnosticMessage(message: MostRxMessage | SocketMostSendMessage, direction: 'rx' | 'tx'): DiagnosticMessage {
    const received = message as MostRxMessage
    const transmitted = message as SocketMostSendMessage
    return { direction, timestamp: Date.now(), sourceAddress: direction === 'rx' ? ((received.sourceAddrHigh || 0) << 8) | (received.sourceAddrLow || 0) : undefined, targetAddress: direction === 'tx' ? ((transmitted.targetAddressHigh || 0) << 8) | (transmitted.targetAddressLow || 0) : undefined, fBlockID: message.fBlockID, instanceID: message.instanceID, fktID: message.fktID, opType: message.opType, telID: received.telID, telLen: received.telLen ?? message.data?.length ?? 0, data: Array.from(message.data || []) as number[] }
  }

  private formatLogMessage(message: DiagnosticMessage): object {
    const hex = (value: number | undefined, width: number) => value === undefined ? undefined : `0x${value.toString(16).toUpperCase().padStart(width, '0')}`
    return { ...message, timestamp: new Date(message.timestamp).toISOString(), sourceAddress: hex(message.sourceAddress, 4), targetAddress: hex(message.targetAddress, 4), fBlockID: hex(message.fBlockID, 2), instanceID: hex(message.instanceID, 2), fktID: hex(message.fktID, 3), opType: hex(message.opType, 2), telID: hex(message.telID, 2), telLen: hex(message.telLen, 2), data: message.data.map((byte) => hex(byte, 2)) }
  }
}
