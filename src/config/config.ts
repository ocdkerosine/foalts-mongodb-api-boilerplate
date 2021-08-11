/* eslint-disable no-unused-vars */
import * as _ from 'lodash'
import { Env } from '@foal/core'

/* istanbul ignore next */
const requireProcessEnv = (name: string) => {
  if (!Env.get(name)) {
    throw new Error(`You must set the ${name} environment variable`)
  }
  return Env.get(name)
}

/* istanbul ignore next */
// if (process.env.NODE_ENV !== 'production') {
//   const dotenv = require('dotenv-safe')
//   dotenv.config({
//     path: path.join(__dirname, '../.env.development'),
//     example: path.join(__dirname, '../.env.example')
//   })
// }

const config = {
  all: {
    env: requireProcessEnv('NODE_ENV') || 'development',
    // root: path.join(__dirname, '..'),
    // port: process.env.PORT || 9000,
    // httpsPort: 443,
    // ip: process.env.IP || '0.0.0.0',
    // apiRoot: process.env.API_ROOT || '',
    // AWS: {
    //   accessKeyId: requireProcessEnv('AWS_ACCESS_KEY_ID'),
    //   secrectAccessKey: requireProcessEnv('AWS_SECRET_ACCESS_KEY'),
    //   region: requireProcessEnv('AWS_REGION'),
    //   bucket: requireProcessEnv('AWS_BUCKET_NAME'),
    //   location: requireProcessEnv('AWS_Uploaded_File_URL_LINK')
    // },
    mongo: {
      options: {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true
      }
    }
  },
  test: {
    // mongo: {
    //   uri: 'mongodb://localhost/agrify-jnr-test',
    //   options: {
    //     debug: false
    //   }
    // }
  },
  development: {
    mongo: {
      uri: requireProcessEnv('DATABASE_URL'),
      options: {
        debug: true
      }
    }
  },
  production: {
    // ip: process.env.IP || undefined,
    // port: process.env.PORT || 8080,
    // httpsPort: 443,
    mongo: {
      uri: requireProcessEnv('DATABASE_URL')
    }
  }
}

module.exports = _.merge(config.all, config[config.all.env])
export default module.exports
