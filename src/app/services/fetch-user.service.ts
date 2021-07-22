import { FetchUser, ServiceManager } from '@foal/core'
import { DocumentType } from '@typegoose/typegoose'
import User, { UserClass } from '../models/user.model'
import * as mongoose from 'mongoose'

export default function fetchUser(): FetchUser {
  return async (id: string|number, services: ServiceManager): Promise<DocumentType<UserClass> | undefined> => {
    if (typeof id === 'number') {
      throw new Error('Unexpected type for MongoDB user ID: number.')
    }
    const user = await User.findOne({ id: mongoose.Types.ObjectId(id) })
    if (user === null) {
      return undefined
    }
    return user
  }
}