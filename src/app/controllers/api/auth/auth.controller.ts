import {
  Context, HttpResponseOK, HttpResponseUnauthorized,
  Post, verifyPassword, ValidateBody, HttpResponseCreated, HttpResponse, HttpResponseNoContent,controller,
  HttpResponseInternalServerError, ApiOperationId, ApiOperationSummary, ApiResponse, ApiUseTag, HttpResponseConflict
} from '@foal/core'
import { getSecretOrPrivateKey, JWTRequired } from '@foal/jwt'
import { sign } from 'jsonwebtoken'
import { promisify } from 'util'
import { SocialAuthController } from './social-auth.controller'
import { DocumentType } from '@typegoose/typegoose'
import { UserClass } from '../../../models'
import { LoggerService } from '../../../services'
import User from '../../../models/user.model'
import fetchUser from '../../../services/fetch-user.service'
import { signUpCredentialsSchema, signInCredentialsSchema } from '../../../schemas'

// @ApiDefineTag({
//   name: 'auth',
//   description: 'Sign Up, Sign In, Sign Out'
// })
@ApiUseTag('auth')
export class AuthController {

    subControllers = [
      controller('/signin', SocialAuthController)
    ]

  @Post('/signup')
  @ApiOperationId('signUp')
  @ApiOperationSummary('Sign up.')
  @ApiResponse(500, { description: 'Something went wrong.', content: { 'application/json': {} } })
  @ApiResponse(409, { description: 'Email already registered.', content: { 'application/json': {} } })
  @ApiResponse(400, { description: 'Bad request.',  content: { 'application/json': {} } })
  @ApiResponse(201, { description: 'User successfully created. Returns created user.', content: { 'application/json': {} } })
  @ValidateBody(signUpCredentialsSchema)
    async signup(ctx: Context): Promise<HttpResponse> {
      try {
        const user = await User.create(ctx.request.body)
        return new HttpResponseCreated(user.view())
      }
      catch (error) {
        LoggerService.log({ level: 'error', message: error })
        if (error.name === 'MongoError' && error.code === (11000 || 11001)) {
          // eslint-disable-next-line no-useless-escape
          const regex = /index\:\ (?:.*\.)?\$?(?:([_a-z0-9]*)(?:_\d*)|([_a-z0-9]*))\s*dup key/i,      
            match =  error.message.match(regex),  
            indexName = match[1] || match[2]
          return new HttpResponseConflict({ message: `${indexName} already registered.` })
        }
        return new HttpResponseInternalServerError({
          err: error.message,
          message: 'Something went wrong.',
          path: ctx.request.path,
        })
      }
    }

  @Post('/signin')
  @ApiOperationId('signIn')
  @ApiOperationSummary('Sign in.')
  @ApiResponse(500, { description: 'Something went wrong.', content: { 'application/json': {} } })
  @ApiResponse(401, { description: 'Email/Password incorrect.', content: { 'application/json': {} } })
  @ApiResponse(400, { description: 'Bad request.',  content: { 'application/json': {} } })
  @ApiResponse(201, { description: 'User successfully created. Returns created user.', content: { 'application/json': {} } })
  @ValidateBody(signInCredentialsSchema)
  async login(ctx: Context): Promise<HttpResponse> {
    try {
      const body = ctx.request.body as Record<string, any>
      const user = await User.findOne({ email: body.email as string })
      if (!user) {
        return new HttpResponseUnauthorized({ message: 'Email/Password incorrect.' })
      }
      if (!user.password) {
        return new HttpResponseUnauthorized({ message: 'Email/Password incorrect.' })
      }
      if (!(await verifyPassword(body.password, user.password))) {
        return new HttpResponseUnauthorized({ message: 'Email/Password incorrect.' })
      }
      return new HttpResponseOK({
        token: await this.createJWT(user)
      })
    }
    catch (error) {
      LoggerService.log({ level: 'error', message: error })
      return new HttpResponseInternalServerError({
        err: error.message,
        message: 'Something went wrong.',
        path: ctx.request.path,
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

  @JWTRequired({ user: fetchUser() })
  @Post('/signout')
  @ApiOperationSummary('Sign out.')
  @ApiResponse(500, { description: 'Something went wrong.', content: { 'application/json': {} } })
  @ApiResponse(401, { description: 'You need to be signed in to access this resource.', content: { 'application/json': {} } })
  @ApiResponse(400, { description: 'Authorization header not found.', content: { 'application/json': {} } })
  @ApiResponse(204, { description: 'No content.' })
  logout(ctx: Context<DocumentType<UserClass>>): HttpResponse {
    try {
      if (!ctx.user) {
        return new HttpResponseUnauthorized({ message: 'You need to be signed in to access this resource.' })
      }
      return new HttpResponseNoContent()
    } 
    catch (error) {
      LoggerService.log({ level: 'error', message: error })
      return new HttpResponseInternalServerError({
        err: error.message,
        message: 'Something went wrong.',
        path: ctx.request.path,
      })
    }
  }
}
