import winston, { LoggerOptions } from 'winston'
import 'winston-daily-rotate-file'
import http from 'http'
import os from 'os'
import { Writable } from 'stream'
import { LOGGER_NAMES, LoggerConfig, LoggerName, loggerEnabledByDefault } from './Globals'

const level = process.env.LOG_LEVEL || 'info'
const colorizer = winston.format.colorize()
const remoteLogUrl = new URL('http://192.168.0.3:4318/logs')
const remoteLogQueue: string[] = []
let remoteLoggingEnabled = false
let remoteLogFlushTimer: NodeJS.Timeout | null = null
let remoteLogRequestInProgress = false

const scheduleRemoteFlush = (delay = 1000): void => {
  if (!remoteLoggingEnabled || remoteLogFlushTimer || remoteLogRequestInProgress) return
  remoteLogFlushTimer = setTimeout(() => {
    remoteLogFlushTimer = null
    flushRemoteLogs()
  }, delay)
  remoteLogFlushTimer.unref()
}

const flushRemoteLogs = (): void => {
  if (!remoteLoggingEnabled || remoteLogRequestInProgress || remoteLogQueue.length === 0) return
  const logs = remoteLogQueue.splice(0, 100).map((line) => {
    try {
      return JSON.parse(line)
    } catch {
      return { message: line }
    }
  })
  const body = JSON.stringify({ application: 'JLR-HU', deviceId: os.hostname(), logs })
  remoteLogRequestInProgress = true

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
        remoteLogQueue.unshift(...logs.map((entry) => JSON.stringify(entry)))
        if (remoteLogQueue.length > 2000) remoteLogQueue.splice(0, remoteLogQueue.length - 2000)
        scheduleRemoteFlush(5000)
      } else {
        scheduleRemoteFlush()
      }
    })
  })

  request.once('timeout', () => request.destroy(new Error('remote log request timed out')))
  request.once('error', () => {
    remoteLogRequestInProgress = false
    remoteLogQueue.unshift(...logs.map((entry) => JSON.stringify(entry)))
    if (remoteLogQueue.length > 2000) remoteLogQueue.splice(0, remoteLogQueue.length - 2000)
    scheduleRemoteFlush(5000)
  })
  request.end(body)
}

const remoteLogStream = new Writable({
  write(chunk, _encoding, callback) {
    if (remoteLoggingEnabled) {
      const line = chunk.toString().trim()
      if (line) {
        remoteLogQueue.push(line)
        if (remoteLogQueue.length > 2000) remoteLogQueue.shift()
        scheduleRemoteFlush(remoteLogQueue.length >= 100 ? 0 : 1000)
      }
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
