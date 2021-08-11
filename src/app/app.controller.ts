import { /*Env, */Context, getAjvInstance, controller, Get, HttpResponse, HttpResponseInternalServerError, HttpResponseNotFound, IAppController, render } from '@foal/core'
import mongoose from '../config/mongoose'
import * as config from '../config/config'
import { ApiController, OpenApiController } from './controllers'
import { LoggerService } from './services/logger-service.service'
import * as ajvErrors from 'ajv-errors'

const configs = config as Record<string, any>

export class AppController implements IAppController {
  subControllers = [
    controller('/api/v2', ApiController),
    controller('/docs', OpenApiController)
  ];

  async init() {
    if (configs.mongo.uri) {
      await mongoose.connect(configs.mongo.uri)
    }
    mongoose.Promise = Promise
    ajvErrors(getAjvInstance())
  }

  @Get('*')
  renderApp(ctx: Context): Promise<HttpResponse>|HttpResponse {
    if (!ctx.request.accepts('html')) {
      return new HttpResponseNotFound()
    }

    return render('./public/index.html')
  }

  // @Post('*')
  // hello(ctx: Context): void {
  //   console.log(ctx.request)

  //   return
  // }

  handleError(error: Error, ctx: Context): HttpResponse|Promise<HttpResponse> {
    LoggerService.log({ level: 'error', message: error })
    return new HttpResponseInternalServerError({
      err: error.message,
      message: 'Something went wrong.',
      path: ctx.request.path
    })
  }

}
