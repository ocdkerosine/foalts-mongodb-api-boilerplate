// import {
//   ApiOperationDescription, ApiOperationId, ApiOperationSummary, ApiResponse,
//   ApiUseTag, Context, Delete, Get, HttpResponseCreated,
//   HttpResponseNoContent, HttpResponseNotFound, HttpResponseOK, Patch, Post,
//   Put, ValidateBody, ValidatePathParam, ValidateQueryParam
// } from '@foal/core';
// import { getRepository } from 'typeorm';

// import { Product, User } from '../../../entities';

// const productSchema = {
//   additionalProperties: false,
//   properties: {
//     text: { type: 'string', maxLength: 255 },
//   },
//   required: [ 'text' ],
//   type: 'object',
// };

// @ApiUseTag('product')
// export class ProductController {

//   @Get()
//   @ApiOperationId('findProducts')
//   @ApiOperationSummary('Find products.')
//   @ApiOperationDescription(
//     'The query parameters "skip" and "take" can be used for pagination. The first ' +
//     'is the offset and the second is the number of elements to be returned.'
//   )
//   @ApiResponse(400, { description: 'Invalid query parameters.' })
//   @ApiResponse(200, { description: 'Returns a list of products.' })
//   @ValidateQueryParam('skip', { type: 'number' }, { required: false })
//   @ValidateQueryParam('take', { type: 'number' }, { required: false })
//   async findProducts(ctx: Context<User>) {
//     const products = await getRepository(Product).find({
//       skip: ctx.request.query.skip,
//       take: ctx.request.query.take,
//       where: {
//         owner: ctx.user
//       }
//     });
//     return new HttpResponseOK(products);
//   }

//   @Get('/:productId')
//   @ApiOperationId('findProductById')
//   @ApiOperationSummary('Find a product by ID.')
//   @ApiResponse(404, { description: 'Product not found.' })
//   @ApiResponse(200, { description: 'Returns the product.' })
//   @ValidatePathParam('productId', { type: 'number' })
//   async findProductById(ctx: Context<User>) {
//     const product = await getRepository(Product).findOne({
//       id: ctx.request.params.productId,
//       owner: ctx.user
//     });

//     if (!product) {
//       return new HttpResponseNotFound();
//     }

//     return new HttpResponseOK(product);
//   }

//   @Post()
//   @ApiOperationId('createProduct')
//   @ApiOperationSummary('Create a new product.')
//   @ApiResponse(400, { description: 'Invalid product.' })
//   @ApiResponse(201, { description: 'Product successfully created. Returns the product.' })
//   @ValidateBody(productSchema)
//   async createProduct(ctx: Context<User>) {
//     const product = await getRepository(Product).save({
//       ...ctx.request.body,
//       owner: ctx.user
//     });
//     return new HttpResponseCreated(product);
//   }

//   @Patch('/:productId')
//   @ApiOperationId('modifyProduct')
//   @ApiOperationSummary('Update/modify an existing product.')
//   @ApiResponse(400, { description: 'Invalid product.' })
//   @ApiResponse(404, { description: 'Product not found.' })
//   @ApiResponse(200, { description: 'Product successfully updated. Returns the product.' })
//   @ValidatePathParam('productId', { type: 'number' })
//   @ValidateBody({ ...productSchema, required: [] })
//   async modifyProduct(ctx: Context<User>) {
//     const product = await getRepository(Product).findOne({
//       id: ctx.request.params.productId,
//       owner: ctx.user
//     });

//     if (!product) {
//       return new HttpResponseNotFound();
//     }

//     Object.assign(product, ctx.request.body);

//     await getRepository(Product).save(product);

//     return new HttpResponseOK(product);
//   }

//   @Put('/:productId')
//   @ApiOperationId('replaceProduct')
//   @ApiOperationSummary('Update/replace an existing product.')
//   @ApiResponse(400, { description: 'Invalid product.' })
//   @ApiResponse(404, { description: 'Product not found.' })
//   @ApiResponse(200, { description: 'Product successfully updated. Returns the product.' })
//   @ValidatePathParam('productId', { type: 'number' })
//   @ValidateBody(productSchema)
//   async replaceProduct(ctx: Context<User>) {
//     const product = await getRepository(Product).findOne({
//       id: ctx.request.params.productId,
//       owner: ctx.user
//     });

//     if (!product) {
//       return new HttpResponseNotFound();
//     }

//     Object.assign(product, ctx.request.body);

//     await getRepository(Product).save(product);

//     return new HttpResponseOK(product);
//   }

//   @Delete('/:productId')
//   @ApiOperationId('deleteProduct')
//   @ApiOperationSummary('Delete a product.')
//   @ApiResponse(404, { description: 'Product not found.' })
//   @ApiResponse(204, { description: 'Product successfully deleted.' })
//   @ValidatePathParam('productId', { type: 'number' })
//   async deleteProduct(ctx: Context<User>) {
//     const product = await getRepository(Product).findOne({
//       id: ctx.request.params.productId,
//       owner: ctx.user
//     });

//     if (!product) {
//       return new HttpResponseNotFound();
//     }

//     await getRepository(Product).delete(ctx.request.params.productId);

//     return new HttpResponseNoContent();
//   }

// }
