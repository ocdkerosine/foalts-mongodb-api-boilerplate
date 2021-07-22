const winston = require('winston');require('winston-daily-rotate-file')
import * as bottleneck from 'bottleneck'
import * as _ from 'lodash'
import * as path from 'path'

const { printf, combine, colorize } = winston.format

const logLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    sql: 4,
    debug: 5
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'blue',
    sql: 'blue',
    debug: 'gray'
  }
}
winston.addColors(logLevels.colors)

export const jsonFormatter = (logEntry: any) => {
  const base = { timestamp: new Date() }
  const json = _.merge(base, logEntry)
  const today = new Date()
  const day = today.toISOString().split('T')[0]
  const hours = today.getUTCHours()
  const minutes = today.getUTCMinutes()
  logEntry['message'] = `[${day} ${hours}:${minutes} UTC]: ${json.message}`
  return logEntry
}

/**
 * Logger Service. Handles logging with winston. Service handles logging time intervals with bottleneck.
 * Bottleneck, because winston will hang up under heavy load.
 */
export const LoggerService = {
  /** "Bottleneck" Limiter for Logger */
  bottleneck: new bottleneck.default({
    maxConcurrent: 1,
    minTime: 5
  }),
  /** Winston logger. See https://github.com/winstonjs/winston#creating-your-own-logger for more details  */
  logger: winston.createLogger({
    level: 'info',
    format: combine(
      colorize(),
      winston.format(jsonFormatter)(),
      printf((info: any) => `${info.level}: ${info.message}`)
    ),
    transports: [
      // new winston.transports.File({ filename: path.join(__dirname, '../../../error.log'), level: 'error' }),
      new winston.transports.DailyRotateFile({ json: true, dirname: path.join(__dirname, '../../../logs/error'), filename: 'error-%DATE%.log', datePattern: 'YYYY-MM-DD-HH', createSymlink: true, symlinkName: 'error.log', maxFiles: '30d', level: 'error', maxSize: '20m', utc: true, zippedArchive: true }),

      // new winston.transports.File({ filename: path.join(__dirname, '../../../logs/combined.log') }),
      new winston.transports.DailyRotateFile({ json: true, dirname: path.join(__dirname, '../../../logs/combined'), filename: 'combined-%DATE%.log', datePattern: 'YYYY-MM-DD-HH', createSymlink: true, symlinkName: 'combined.log', maxFiles: '30d', maxSize: '20m', utc: true, zippedArchive: true }),
    ],
    exceptionHandlers: [
      // new winston.transports.File({ filename: path.join(__dirname, '../../../logs/exceptions.log') }),
      new winston.transports.DailyRotateFile({ json: true, dirname: path.join(__dirname, '../../../logs/exception'), filename: 'exceptions-%DATE%.log', datePattern: 'YYYY-MM-DD-HH', createSymlink: true, symlinkName: 'exceptions.log', maxFiles: '30d', maxSize: '20m', utc: true, zippedArchive: true })
    ],
    rejectionHandlers: [
      // new winston.transports.File({ filename: path.join(__dirname, '../../../logs/exceptions.log') }),
      new winston.transports.DailyRotateFile({ json: true, dirname: path.join(__dirname, '../../../logs/rejection'), filename: 'rejections-%DATE%.log', datePattern: 'YYYY-MM-DD-HH', createSymlink: true, symlinkName: 'rejections.log', maxFiles: '30d', maxSize: '20m', utc: true, zippedArchive: true })
    ],
    exitOnError: false
  }),
  /** Returns winston logger */
  getLogger() {
    return LoggerService.logger
  },
  /**
   * Logs an event with winston
   * @param param0.level Log level. e.g. warn, info, error
   * @param param0.message Log message
   */
  log({ level, message }: {level: string; message: any }) {
    LoggerService.bottleneck.schedule({}, () => {
      return Promise.resolve(LoggerService.getLogger().log({ level, message }))
    })
  },
  /**
   * Query winston logs
   * @param param0.skip Log level. e.g. warn, info, error
   * @param param0.take Log message
   */
  query({ from, until, limit, start, order }: 
    { from?: Date | undefined; until?: Date | undefined;
      limit?: number | undefined; start?: number | undefined;
      order?: 'desc' | 'asc' | undefined; 
    }, callback?: ((err: Error, results: any) => void) | undefined)
  {
    LoggerService.bottleneck.schedule({}, () => {
      return Promise.resolve(LoggerService.getLogger().query({ 
        from: from || (new Date() as any - (24 * 60 * 60 * 1000)) as unknown as Date,
        until: until || new Date(),
        limit: limit || 10,
        start: start || 0,
        order: order || 'desc',
        fields: ['level','message']
      }, callback))
    })
  }
}

LoggerService.logger.add(new winston.transports.Console({
  format: winston.format.simple(),
  handleExceptions: true,
  handleRejections: true
}))
