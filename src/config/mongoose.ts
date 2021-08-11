import * as Promise from 'bluebird'
import mongoose = require('mongoose')
import * as config from './config'

const configs = config as Record<string, any>

Object.keys(configs.mongo.options || { }).forEach(key => {
  mongoose.set(key, configs.mongo.options[key])
})

mongoose.Promise = Promise
/* istanbul ignore next */
mongoose.Types.ObjectId.prototype.view = function () {
  return { id: this.toString() }
}

/* istanbul ignore next */
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error: ' + err)
  process.exit(-1)
})

export default mongoose
