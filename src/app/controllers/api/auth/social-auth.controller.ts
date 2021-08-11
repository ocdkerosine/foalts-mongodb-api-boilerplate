import { Context, dependency, Get, HttpResponseRedirect, HttpResponse, Session, HttpResponseInternalServerError } from '@foal/core'
import { GoogleProvider } from '@foal/social'
import fetch from 'node-fetch'
import { S3Disk } from '@foal/aws-s3'
import { promisify } from 'util'
import { getSecretOrPrivateKey } from '@foal/jwt'
import { sign } from 'jsonwebtoken'
import { DocumentType } from '@typegoose/typegoose'
import { UserClass } from '../../../models'
import { LoggerService } from '../../../services'
import User from '../../../models/user.model'

interface GoogleUserInfo {
  email: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  picture?: string;
}

export class SocialAuthController {
  @dependency
  google: GoogleProvider;

  @dependency
  s3: S3Disk;

  @Get('/google')
  redirectToGoogle(ctx: Context): Promise<HttpResponse> | HttpResponse {
    try {
      return this.google.redirect()
    }
    catch (error) {
      LoggerService.log({ level: 'error', message: error })
      return new HttpResponseInternalServerError({
        err: error.message,
        message: 'Something went wrong.',
        path: ctx.request.path
      })
    }
  }

  @Get('/google/callback')
  async handleGoogleRedirection(ctx: Context<Session>): Promise<HttpResponse> {
    try {
      const { userInfo } = await this.google.getUserInfo<GoogleUserInfo>(ctx)
      if (!userInfo.email) {
        throw new Error('Google should have returned an email address.')
      }
      let user = await User.findOne({ email: userInfo.email })
      if (!user) {
        user = new User()
        user.email = userInfo.email
        user.firstName = userInfo.firstName ?? userInfo.email.split(' ')[0] ?? '' as string
        user.lastName = userInfo.lastName ?? userInfo.email.split(' ')[1] ??  '' as string
        if (userInfo.picture) {
          const response = await fetch(userInfo.picture)
          const buffer = await response.buffer()
          const { path } = await this.s3.write(`images/${user.email}`, buffer, { name: 'avatar.jpg' })
          user.avatar = path
        }
        await user.save()
      }
      return new HttpResponseRedirect(`/?token=${
        await this.createJWT(user)
      }`)
    }
    catch (error) {
      LoggerService.log({ level: 'error', message: error })
      return new HttpResponseInternalServerError({
        err: error.message,
        message: 'Something went wrong.',
        path: ctx.request.path
      })
    }
  }

  private async createJWT(user: DocumentType<UserClass>): Promise<string> {
    const payload = {
      email: user.email,
      id: user.id as string
    }
    return promisify(sign as any)(
      payload,
      getSecretOrPrivateKey(),
      { subject: user.id as string, expiresIn: '1h'  }
    ) as Promise<string>
  }
}
