import { Env, ApiInfo, ApiServer, /*UseSessions, */controller, Options, Context,
  HttpResponseNoContent, Hook, HttpResponse, ApiExternalDoc } from '@foal/core'
// import fetchUser from '../services/fetch-user.service'
// import User from '../models/user.model'
import { LogController, /*UserController,*/ AuthController } from './api'

@ApiInfo({
  title: 'Agrific API',
  version: '2.0.0',
  description: 'This is a sample server Petstore server.  You can find out more about' +
  '[http://swagger.io](http://swagger.io)`special-key`' +
  'For this sample, you can use the api key `special-key` to test the authorization     filters.',
  contact: {
    'name': 'the developer',
    'email': 'oshoba@proditt.com'
  }
})
@ApiServer({
  description: 'API Server',
  url: `${Env.get('API_URL')}/api/v2`
})
@ApiExternalDoc({
  description: 'Find out more about Agrific',
  url: 'https://agrific.co'
})
@Hook(ctx => (response: HttpResponse): void => {
  response.setHeader('Access-Control-Allow-Origin', ctx.request.get('Origin') || '*')
  response.setHeader('Access-Control-Allow-Credentials', 'true')
})
// @UseSessions({
//   cookie: true,
//   user: fetchMongoDBUser(User),
//   userCookie: (ctx: Context<User|undefined>) => ctx.user ? JSON.stringify({ id: ctx.user.id, email: ctx.user.email }) : ''
// })
export class ApiController {

  subControllers = [
    controller('/auth', AuthController),
    controller('/logs', LogController)
    // controller('/users', UserController),
    // controller('/product', ProductController)
  ];

  @Options('*')
  options(ctx: Context): HttpResponse {
    const response = new HttpResponseNoContent()
    response.setHeader('Access-Control-Allow-Methods', 'HEAD, GET, POST, PUT, PATCH, DELETE')
    // You may need to allow other headers depending on what you need.
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    return response
  }
}
