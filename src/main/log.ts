import winston, { LoggerOptions } from 'winston'
import 'winston-daily-rotate-file'
import { LOGGER_NAMES, LoggerConfig, LoggerName } from './Globals'

const level = process.env.LOG_LEVEL || 'info'
const colorizer = winston.format.colorize()

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

const loggerOptions = (name: string): winston.LoggerOptions => ({
  level,
  defaultMeta: { service: name },
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.splat(),
    winston.format.errors({ stack: true }),
    winston.format.simple()
  ),
  transports: [consoleTransport, fileTransport]
})

export function getLogger(name: LoggerName | 'jlrHU' | 'pimost'): winston.Logger {
  if (!winston.loggers.has(name)) winston.loggers.add(name, loggerOptions(name))
  return winston.loggers.get(name)
}

export function configureLogging(config: LoggerConfig = {}): void {
  for (const name of LOGGER_NAMES) getLogger(name).silent = config[name] === false
}

// Keep the legacy names available while the old implementation remains in the tree.
getLogger('jlrHU')
getLogger('pimost')
configureLogging()
