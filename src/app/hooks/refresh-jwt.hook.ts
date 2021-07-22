import { Hook, Context, HookDecorator, HttpResponse, isHttpResponseServerError } from '@foal/core'
import { getSecretOrPrivateKey } from '@foal/jwt'
import { sign } from 'jsonwebtoken'
import { promisify } from 'util'
import { UserClass } from '../models'
import { DocumentType } from '@typegoose/typegoose'

export function RefreshJWT(): HookDecorator {
  return Hook((ctx: Context<DocumentType<UserClass>>) => {
    const user = ctx.user

    if (!ctx.user) {
      return
    }

    return async (response: HttpResponse): Promise<void> => {
      if (isHttpResponseServerError(response)) {
        return
      }


      const newToken = await (promisify(sign as any)(
        // The below object assumes that ctx.user is
        // the decoded payload (default behavior).
        {
          email: user.email,
          id: user.id as string
        },
        getSecretOrPrivateKey(),
        { subject: user.id as string, expiresIn: '1h' }
      ) as Promise<string>)

      // const newToken = sign(
      //   // The below object assumes that ctx.user is
      //   // the decoded payload (default behavior).
      //   {
      //     email: email,
      //     id: id
      //   },
      //   getSecretOrPrivateKey(),
      //   { subject: id.toString(), expiresIn: '1h' }
      // ) as any

      response.setHeader('Authorization', newToken)
    }

  })
}
