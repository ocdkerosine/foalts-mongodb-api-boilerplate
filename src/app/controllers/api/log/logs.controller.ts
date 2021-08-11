import {
  Get, ApiUseTag, ApiOperationDescription, ApiOperationId, ApiOperationSummary, ApiResponse,
  Context, ValidateQueryParam, HttpResponse, HttpResponseConflict, HttpResponseInternalServerError, ApiDeprecated, HttpResponseMethodNotAllowed
} from '@foal/core'
import { JWTRequired } from '@foal/jwt'
import { AdminRequired } from '../../../hooks'
import { LoggerService } from '../../../services/logger-service.service'
import fetchUser from '../../../services/fetch-user.service'

@ApiUseTag('log')
@ApiDeprecated()
@JWTRequired({ user: fetchUser() })
export class LogController {

  @Get()
  @ApiOperationId('findLogs')
  @ApiOperationSummary('Find logs.')
  @ApiOperationDescription(
    'The query parameters "skip", "take", "from", "until" and "order" can be used for pagination. The first ' +
    'is the offset and the second is the number of elements to be returned, etc.'
  )
  @ApiResponse(405, { description: 'Temporarily disabled.' })
  @ApiResponse(403, { description: 'Forbidden.' })
  @ApiResponse(401, { description: 'Unauthorized.' })
  @ApiResponse(400, { description: 'Invalid query parameters.' })
  @ApiResponse(200, { description: 'Returns a list of logs.' })
  @AdminRequired()
  @ValidateQueryParam('skip', { type: 'number' }, { required: false })
  @ValidateQueryParam('take', { type: 'number' }, { required: false })
  @ValidateQueryParam('from', { type: 'string' }, { required: false })
  @ValidateQueryParam('until', { type: 'string' }, { required: false })
  @ValidateQueryParam('order', { type: 'string' }, { required: false })
  retrieveLogs(ctx: Context): HttpResponse {
    try {
      // const options = {
      //   from: (new Date() as any - (24 * 60 * 60 * 1000)) as unknown as Date,
      //   until: new Date(),
      //   limit: ctx.request.query.take,
      //   start: ctx.request.query.skip,
      //   order: ctx.request.query.order
      // }
      // // let promise = Promise.resolve()
      // LoggerService.query(options, (err, results) => {
      //   if (err) {
      //     throw err
      //   }
      //   console.log(results)
      // })
      return new HttpResponseMethodNotAllowed()
    } catch (error) {
      LoggerService.log({ level: 'error', message: error })
      if (error.name === 'MongoError' && error.code === 11000) {
        return new HttpResponseConflict({ message: 'Email already registered.' })
      }
      return new HttpResponseInternalServerError({
        err: error.message,
        message: 'Something went wrong.',
        path: ctx.request.path
      })

    }
  }
}
