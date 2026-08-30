import winston, { LoggerOptions } from 'winston'
import 'winston-daily-rotate-file'

winston.addColors({ jlrHU: 'bold deep pink', pimost: 'bold deep pink', socket: 'yellow' })
const colorizer = winston.format.colorize()

winston.loggers.add('jlrHU', {
  level: process.env.LOG_LEVEL || 'info',

  defaultMeta: {
    service: 'jlrHU'
  },

  format: winston.format.combine(
    winston.format.cli(),
    winston.format.errors({ stack: true }),
    winston.format.timestamp(),

    winston.format.printf((info) => {
      return `${colorizer.colorize('socket', info.service)}${info.level}:${info.message} `
    })
  ),

  transports: [new winston.transports.Console()]
})
interface TransportOptions {
  [index: string]: LoggerOptions
}
const options: TransportOptions = {
  console: {
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
      winston.format.cli(),
      winston.format.metadata(),
      winston.format.errors({ stack: true }),
      winston.format.timestamp(),
      winston.format.printf((info) => {
        const out = `${colorizer.colorize('socket', info.metadata.service)}${info.level}:${
          info.message
        } `
        return out
      })
    )
  }
}

const fileRotateTransport = new winston.transports.DailyRotateFile({
  filename: 'combined-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxFiles: '7d',
  maxSize: '2m',
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.metadata(),
    winston.format.timestamp(),
    winston.format.uncolorize(),
    winston.format.errors({ stack: true }),
    winston.format.printf((info) => {
      const out = `pimost-${info.level}:${info.message}`
      return out
    })
  )
})

winston.loggers.add('pimost', {
  level: process.env.LOG_LEVEL || 'info',

  defaultMeta: {
    service: 'pimost'
  },

  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.printf((info) => {
      const stack = info.stack || info.message

      return `${colorizer.colorize('socket', info.service)}${info.level}: ${stack}`
    })
  ),

  transports: [new winston.transports.Console(options['console']), fileRotateTransport]
})
