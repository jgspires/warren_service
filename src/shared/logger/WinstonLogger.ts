import { createLogger, format, transports } from 'winston'
import { SERVICE_NAME } from '../../main/config'

export const LOG_PATH = process.env.LOG_PATH || 'logs'

export const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  defaultMeta: { service: SERVICE_NAME },
  transports: [
    //
    // - Write to all logs with level `info` and below to `quick-start-combined.log`.
    // - Write all logs error (and below) to `quick-start-error.log`.
    //
    new transports.File({ filename: `${LOG_PATH}/error.log`, level: 'error' }),
    new transports.File({ filename: `${LOG_PATH}/combined.log` })
  ]
})

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.simple())
    })
  )
}
