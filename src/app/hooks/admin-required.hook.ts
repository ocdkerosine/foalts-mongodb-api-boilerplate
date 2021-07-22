import { Hook, HookDecorator, HttpResponseForbidden, HttpResponseUnauthorized, Context } from '@foal/core'
import { UserClass } from '../models'
import { DocumentType } from '@typegoose/typegoose'

export function AdminRequired(): HookDecorator {
  return Hook((ctx: Context<DocumentType<UserClass>>) => {
    if (!ctx.user) {
      return new HttpResponseUnauthorized()
    }
    if (!ctx.user.admin) {
      return new HttpResponseForbidden()
    }
  })
}
