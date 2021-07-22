// import {
//   Context,
//   Post, HttpResponse, dependency, Get, HttpResponseBadRequest, HttpResponseOK, HttpResponseUnauthorized
// } from '@foal/core'
// import { UserClass } from '../../../models'
// // import { LoginController } from '.';
// import { JWTRequired } from '@foal/jwt'
// import { DocumentType } from '@typegoose/typegoose'
// // import { RefreshJWT } from '../../../hooks'
// import fetchUser from '../../../services/fetch-user.service'
// import { S3Disk } from '@foal/aws-s3'
// import { ValidateMultipartFormDataBody } from '@foal/storage'
// import User from '../../../models/user.model'

// // const credentialsSchema = {
// //   additionalProperties: false,
// //   properties: {
// //     email: { type: 'string', format: 'email', maxLength: 255 },
// //     password: { type: 'string' },
// //     firstName: { type: 'string', maxLength: 255 },
// //     lastName: { type: 'string', maxLength: 255 }
// //   },
// //   required: [ 'email', 'password' ],
// //   type: 'object'
// // }

// const uploadProfileImageFormDataSchema = {
//   files: {
//     avatar: { required: true }
//   },
//   fields: {
//     name: { type: 'string', maxLength: 255 }
//   }
// }

// @JWTRequired({ user: fetchUser(User) })
// export class UserController {
//   // subControllers = [
//   //   controller('/user', LoginController)
//   // ];

//   @dependency
//   s3: S3Disk

//   @Get('/avatar')
//   async readProfileImage(ctx: Context<UserClass>): Promise<HttpResponse> {
//     const user = ctx.user
//     if (!user.avatar) {
//       return this.s3.createHttpResponse('user1@example.com-avatar.jpg')
//     }
//     return this.s3.createHttpResponse(user.avatar)
//     // try {
//     //   console.log(await story.save())
//     // } catch (error) {
//     //   console.error(error)
//     // }
//   }

//   @Post()
//   @ValidateMultipartFormDataBody(uploadProfileImageFormDataSchema)
//   async updateProfileImage(ctx: Context<DocumentType<UserClass> | undefined>): Promise<HttpResponse> {
//     const body = ctx.request.body as Record<string, any>
//     const files = body.files as Record<string, any>
//     const user = ctx.user
//     interface File extends Blob {
//       readonly mimeType: string;
//       readonly buffer: Buffer;
//   }
//     const { buffer, mimeType } = files.avatar as File
//     if (!mimeType.includes( 'image/' )) return new HttpResponseBadRequest('Only Images Allowed')

//     if (!user) {
//       return new HttpResponseUnauthorized()
//     }

//     if (user.avatar) {
//         await this.s3.delete(user.avatar)
//       }
//     const { path } = await this.s3.write(`images/${user.email}`, buffer, { name: 'avatar.jpg' })
//     user.avatar = path
//     await user.save()
//     return new HttpResponseOK()
//     // try {
//     //   console.log(await story.save())
//     // } catch (error) {
//     //   console.error(error)
//     // }
//   }

// @Get()
// @ApiOperationId('findLogss')
// @ApiOperationSummary('Find logss.')
// @ApiOperationDescription(
//   'The query parameters "skip" and "take" can be used for pagination. The first ' +
//   'is the offset and the second is the number of elements to be returned.'
// )
// @ApiResponse(400, { description: 'Invalid query parameters.' })
// @ApiResponse(200, { description: 'Returns a list of logss.' })
// @ValidateQueryParam('skip', { type: 'number' }, { required: false })
// @ValidateQueryParam('take', { type: 'number' }, { required: false })
// async findLogss(ctx: Context) {
//   const logss = await getRepository(Logs).find({
//     skip: ctx.request.query.skip,
//     take: ctx.request.query.take,
//     where: {},
//   });
//   return new HttpResponseOK(logss);
// }

// @Get('/:logsId')
// @ApiOperationId('findLogsById')
// @ApiOperationSummary('Find a logs by ID.')
// @ApiResponse(404, { description: 'Logs not found.' })
// @ApiResponse(200, { description: 'Returns the logs.' })
// @ValidatePathParam('logsId', { type: 'number' })
// async findLogsById(ctx: Context) {
//   const logs = await getRepository(Logs).findOne(ctx.request.params.logsId);

//   if (!logs) {
//     return new HttpResponseNotFound();
//   }

//   return new HttpResponseOK(logs);
// }

// @Post()
// @ApiOperationId('createLogs')
// @ApiOperationSummary('Create a new logs.')
// @ApiResponse(400, { description: 'Invalid logs.' })
// @ApiResponse(201, { description: 'Logs successfully created. Returns the logs.' })
// @ValidateBody(logsSchema)
// async createLogs(ctx: Context) {
//   const logs = await getRepository(Logs).save(ctx.request.body);
//   return new HttpResponseCreated(logs);
// }

// @Patch('/:logsId')
// @ApiOperationId('modifyLogs')
// @ApiOperationSummary('Update/modify an existing logs.')
// @ApiResponse(400, { description: 'Invalid logs.' })
// @ApiResponse(404, { description: 'Logs not found.' })
// @ApiResponse(200, { description: 'Logs successfully updated. Returns the logs.' })
// @ValidatePathParam('logsId', { type: 'number' })
// @ValidateBody({ ...logsSchema, required: [] })
// async modifyLogs(ctx: Context) {
//   const logs = await getRepository(Logs).findOne(ctx.request.params.logsId);

//   if (!logs) {
//     return new HttpResponseNotFound();
//   }

//   Object.assign(logs, ctx.request.body);

//   await getRepository(Logs).save(logs);

//   return new HttpResponseOK(logs);
// }

// @Put('/:logsId')
// @ApiOperationId('replaceLogs')
// @ApiOperationSummary('Update/replace an existing logs.')
// @ApiResponse(400, { description: 'Invalid logs.' })
// @ApiResponse(404, { description: 'Logs not found.' })
// @ApiResponse(200, { description: 'Logs successfully updated. Returns the logs.' })
// @ValidatePathParam('logsId', { type: 'number' })
// @ValidateBody(logsSchema)
// async replaceLogs(ctx: Context) {
//   const logs = await getRepository(Logs).findOne(ctx.request.params.logsId);

//   if (!logs) {
//     return new HttpResponseNotFound();
//   }

//   Object.assign(logs, ctx.request.body);

//   await getRepository(Logs).save(logs);

//   return new HttpResponseOK(logs);
// }

// @Delete('/:logsId')
// @ApiOperationId('deleteLogs')
// @ApiOperationSummary('Delete a logs.')
// @ApiResponse(404, { description: 'Logs not found.' })
// @ApiResponse(204, { description: 'Logs successfully deleted.' })
// @ValidatePathParam('logsId', { type: 'number' })
// async deleteLogs(ctx: Context) {
//   const logs = await getRepository(Logs).findOne(ctx.request.params.logsId);

//   if (!logs) {
//     return new HttpResponseNotFound();
//   }

//   await getRepository(Logs).delete(ctx.request.params.logsId);

//   return new HttpResponseNoContent();
// }
// }
