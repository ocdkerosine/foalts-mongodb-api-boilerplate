import { Context, Hook, HttpResponseUnauthorized } from '@foal/core'
import { SwaggerController } from '@foal/swagger'
import { ApiController } from './api.controller'

@Hook((ctx: Context) => {
  const token = ctx.request.get('Authorization')
  if (!token || !token.includes('Basic ')) {
    const response = new HttpResponseUnauthorized('Authorization Required')
    response.setHeader('WWW-Authenticate', 'Basic realm="Authorization Required"')
    return response
  } else {
    const credentials = Buffer.from((token.split(' ').pop()) as string, 'base64').toString('ascii').split(':');
    if (credentials[0] === 'username' && credentials[1] === 'password') {
      return
    } else {
      return new HttpResponseUnauthorized('Access denied, Incorrect credentials)');
    }
  }
})
export class OpenApiController extends SwaggerController  {

  options = [{
    name: 'v2',
    controllerClass: ApiController,
    primary: true
  }]

  uiOptions = { operationsSorter: 'method' }
}
