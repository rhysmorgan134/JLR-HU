import winston from 'winston'

winston.addColors({ jlrHU: 'bold deep pink' })
const colorizer = winston.format.colorize()

winston.loggers.add('jlrHU', {
  level: process.env.SOCKETMOST_LOG_LEVEL || 'info',
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
  ),
  defaultMeta: {
    service: 'jlrHU'
  },
  transports: [new winston.transports.Console()]
})
