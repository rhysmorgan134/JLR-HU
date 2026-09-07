import winston, { LoggerOptions } from 'winston'
import 'winston-daily-rotate-file'
import http from 'http'
import os from 'os'
import fs from 'fs'
import path from 'path'
import { Writable } from 'stream'
import { LOGGER_NAMES, LoggerConfig, LoggerName, loggerEnabledByDefault } from './Globals'

const level = process.env.LOG_LEVEL || 'info'
const colorizer = winston.format.colorize()
const remoteLogUrl = new URL('http://192.168.0.3:4318/logs')
const remoteLogQueue: string[] = []
let remoteLoggingEnabled = false
let remoteLogFlushTimer: NodeJS.Timeout | null = null
let remoteLogRequestInProgress = false
let remoteLogSpoolPath: string | null = null
let spoolWrite: Promise<void> = Promise.resolve()

export function configureRemoteLogSpool(directory: string): void {
  fs.mkdirSync(directory, { recursive: true })
  remoteLogSpoolPath = path.join(directory, 'pending.jsonl')
  if (!fs.existsSync(remoteLogSpoolPath)) return
  const persisted = fs.readFileSync(remoteLogSpoolPath, 'utf8').split('\n').filter(Boolean)
  remoteLogQueue.unshift(...persisted)
}

const appendToSpool = (line: string): void => {
  if (!remoteLogSpoolPath) return
  const spoolPath = remoteLogSpoolPath
  spoolWrite = spoolWrite.then(() => fs.promises.appendFile(spoolPath, `${line}\n`, 'utf8')).catch(() => undefined)
}

const removeSentFromSpool = (count: number): void => {
  if (!remoteLogSpoolPath) return
  const spoolPath = remoteLogSpoolPath
  spoolWrite = spoolWrite.then(async () => {
    const contents = await fs.promises.readFile(spoolPath, 'utf8').catch(() => '')
    const remaining = contents.split('\n').filter(Boolean).slice(count)
    const temporaryPath = `${spoolPath}.tmp`
    await fs.promises.writeFile(temporaryPath, remaining.length ? `${remaining.join('\n')}\n` : '', 'utf8')
    await fs.promises.rename(temporaryPath, spoolPath)
  }).catch(() => undefined)
}

const scheduleRemoteFlush = (delay = 1000): void => {
  if (!remoteLoggingEnabled || remoteLogFlushTimer || remoteLogRequestInProgress) return
  remoteLogFlushTimer = setTimeout(() => {
    remoteLogFlushTimer = null
    void flushRemoteLogs().catch(() => undefined)
  }, delay)
  remoteLogFlushTimer.unref()
}

const flushRemoteLogs = async (force = false): Promise<number> => {
  await spoolWrite
  if ((!remoteLoggingEnabled && !force) || remoteLogRequestInProgress || remoteLogQueue.length === 0) {
    return 0
  }
  const lines = remoteLogQueue.slice(0, 100)
  const logs = lines.map((line) => {
    try {
      return JSON.parse(line)
    } catch {
      return { message: line }
    }
  })
  const body = JSON.stringify({ application: 'JLR-HU', deviceId: os.hostname(), logs })
  remoteLogRequestInProgress = true

  return new Promise((resolve, reject) => {
    const request = http.request({
      hostname: remoteLogUrl.hostname,
      port: remoteLogUrl.port,
      path: remoteLogUrl.pathname,
      method: 'POST',
      timeout: 3000,
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
    }, (response) => {
      response.resume()
      response.once('end', () => {
        remoteLogRequestInProgress = false
        if (response.statusCode == null || response.statusCode < 200 || response.statusCode >= 300) {
          scheduleRemoteFlush(5000)
          reject(new Error(`log receiver returned HTTP ${response.statusCode ?? 'unknown'}`))
        } else {
          remoteLogQueue.splice(0, lines.length)
          removeSentFromSpool(lines.length)
          scheduleRemoteFlush()
          resolve(logs.length)
        }
      })
    })

    request.once('timeout', () => request.destroy(new Error('remote log request timed out')))
    request.once('error', () => {
      remoteLogRequestInProgress = false
      scheduleRemoteFlush(5000)
      reject(new Error('unable to connect to the log receiver at 192.168.0.3:4318'))
    })
    request.end(body)
  })
}

export async function sendRemoteLogsNow(): Promise<number> {
  const queuedAtStart = remoteLogQueue.length
  let sent = 0
  while (sent < queuedAtStart) {
    const batchSize = await flushRemoteLogs(true)
    if (batchSize === 0) break
    sent += batchSize
  }
  return sent
}

const remoteLogStream = new Writable({
  write(chunk, _encoding, callback) {
    const line = chunk.toString().trim()
    if (line) {
      remoteLogQueue.push(line)
      appendToSpool(line)
      if (remoteLoggingEnabled) scheduleRemoteFlush(remoteLogQueue.length >= 100 ? 0 : 1000)
    }
    callback()
  }
})

export function setRemoteLoggingNetwork(ssid: string | null): void {
  remoteLoggingEnabled = ssid === 'RandB'
  if (!remoteLoggingEnabled && remoteLogFlushTimer) {
    clearTimeout(remoteLogFlushTimer)
    remoteLogFlushTimer = null
  } else if (remoteLoggingEnabled) {
    scheduleRemoteFlush()
  }
}

interface TransportOptions { [index: string]: LoggerOptions }
const options: TransportOptions = {
  console: {
    level,
    format: winston.format.combine(
      winston.format.cli(),
      winston.format.metadata(),
      winston.format.errors({ stack: true }),
      winston.format.timestamp(),
      winston.format.printf((info) =>
        `${colorizer.colorize('info', String(info.metadata.service))} ${info.level}: ${info.message}`
      )
    )
  }
}

const consoleTransport = new winston.transports.Console(options.console)
const fileTransport = new winston.transports.DailyRotateFile({
  filename: 'combined-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxFiles: '7d',
  maxSize: '2m',
  level,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.uncolorize(),
    winston.format.errors({ stack: true }),
    winston.format.printf((info) =>
      `${info.timestamp} ${info.service} ${info.level}: ${info.stack || info.message}`
    )
  )
})

const remoteTransport = new winston.transports.Stream({
  stream: remoteLogStream,
  level,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.uncolorize(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  )
})

const loggerOptions = (name: string): winston.LoggerOptions => ({
  level,
  defaultMeta: { service: name },
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.splat(),
    winston.format.errors({ stack: true }),
    winston.format.simple()
  ),
  transports: [consoleTransport, fileTransport, remoteTransport]
})

export function getLogger(name: LoggerName | 'jlrHU' | 'pimost'): winston.Logger {
  if (!winston.loggers.has(name)) winston.loggers.add(name, loggerOptions(name))
  return winston.loggers.get(name)
}

export function configureLogging(config: LoggerConfig = {}): void {
  for (const name of LOGGER_NAMES) {
    getLogger(name).silent = !(config[name] ?? loggerEnabledByDefault(name))
  }
}

// Keep the legacy names available while the old implementation remains in the tree.
getLogger('jlrHU')
getLogger('pimost')
configureLogging()
