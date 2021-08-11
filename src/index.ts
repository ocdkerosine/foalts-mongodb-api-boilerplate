import 'source-map-support/register'

// "preinstall": "npm install pm2 -g && pm2 install pm2-logrotate",
// std
import * as http from 'http'

// 3p
import { Config, createApp, displayServerURL } from '@foal/core'

import * as mongoose from 'mongoose'

import { LoggerService } from './app/services'

// App
import { AppController } from './app/app.controller'

async function main(): Promise<void> {
  const app = await createApp(AppController)

  const server = http.createServer(app)
  const port = Config.get('port', 'number', 3001)

  const shutdownNow = (): void => {
    LoggerService.log({ level: 'error', message: 'Could not close connections in time, forcefully shutting down.' })
    process.exit(1)
  }

  let shuttingDown = false

  const gracefulShutdown = (): void => {
    if (shuttingDown) return
    LoggerService.log({ level: 'info', message: 'Shutting down.' })
    shuttingDown = true
    server.close()
    setTimeout(shutdownNow, 20 * 1000)
  }

  const handleKill = (): void => {
    LoggerService.log({
      level: 'error',
      message: 'Recieved kill command. Gracefully shutting down.'
    })
    gracefulShutdown()
  }

  const handleUncaughtException = (err: any): void => {
    LoggerService.log({ level: 'error', message: err as string  })
    gracefulShutdown()
  }

  server.on('close', () => {
    LoggerService.log({ level: 'info', message: 'Server shutdown successful. Closing DB connection.' })
    mongoose.connection.close(() => {
      LoggerService.log({ level: 'info', message: 'Shutdown complete.' })
    })
  })

  process.on('message', msg => {
    if (msg === 'shutdown') handleKill()
  })

  process.on('SIGTERM', handleKill)

  process.on('SIGINT', handleKill)

  process.on('uncaughtException', handleUncaughtException)

  server.listen(port, () => displayServerURL(port))
}

main()
  .catch(err => {
    LoggerService.log({ level: 'error', message: err })
    process.exit(1)
  })

// TODO use node-skeleton setup to make this better then prepare for v3
