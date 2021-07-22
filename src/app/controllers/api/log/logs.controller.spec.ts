// // std
// import { notStrictEqual, ok, strictEqual } from 'assert';

// // 3p
// import {
//   Context, createController, getHttpMethod, getPath,
//   isHttpResponseCreated, isHttpResponseNoContent,
//   isHttpResponseNotFound, isHttpResponseOK
// } from '@foal/core';
// import { createConnection, getConnection, getRepository } from 'typeorm';

// // App
// import { Logs } from '../../../entities';
// import { LogsController } from './logs.controller';

// describe('LogsController', () => {

//   let controller: LogsController;
//   let logs1: Logs;
//   let logs2: Logs;

//   before(() => createConnection());

//   after(() => getConnection().close());

//   beforeEach(async () => {
//     controller = createController(LogsController);

//     const repository = getRepository(Logs);
//     await repository.clear();
//     [ logs1, logs2 ] = await repository.save([
//       {
//         text: 'Logs 1'
//       },
//       {
//         text: 'Logs 2'
//       },
//     ]);
//   });

//   describe('has a "findLogss" method that', () => {

//     it('should handle requests at GET /.', () => {
//       strictEqual(getHttpMethod(LogsController, 'findLogss'), 'GET');
//       strictEqual(getPath(LogsController, 'findLogss'), undefined);
//     });

//     it('should return an HttpResponseOK object with the logs list.', async () => {
//       const ctx = new Context({ query: {} });
//       const response = await controller.findLogss(ctx);

//       if (!isHttpResponseOK(response)) {
//         throw new Error('The returned value should be an HttpResponseOK object.');
//       }

//       if (!Array.isArray(response.body)) {
//         throw new Error('The response body should be an array of logss.');
//       }

//       strictEqual(response.body.length, 2);
//       ok(response.body.find(logs => logs.text === logs1.text));
//       ok(response.body.find(logs => logs.text === logs2.text));
//     });

//     it('should support pagination', async () => {
//       const logs3 = await getRepository(Logs).save({
//         text: 'Logs 3',
//       });

//       let ctx = new Context({
//         query: {
//           take: 2
//         }
//       });
//       let response = await controller.findLogss(ctx);

//       strictEqual(response.body.length, 2);
//       ok(response.body.find(logs => logs.id === logs1.id));
//       ok(response.body.find(logs => logs.id === logs2.id));
//       ok(!response.body.find(logs => logs.id === logs3.id));

//       ctx = new Context({
//         query: {
//           skip: 1
//         }
//       });
//       response = await controller.findLogss(ctx);

//       strictEqual(response.body.length, 2);
//       ok(!response.body.find(logs => logs.id === logs1.id));
//       ok(response.body.find(logs => logs.id === logs2.id));
//       ok(response.body.find(logs => logs.id === logs3.id));
//     });

//   });

//   describe('has a "findLogsById" method that', () => {

//     it('should handle requests at GET /:logsId.', () => {
//       strictEqual(getHttpMethod(LogsController, 'findLogsById'), 'GET');
//       strictEqual(getPath(LogsController, 'findLogsById'), '/:logsId');
//     });

//     it('should return an HttpResponseOK object if the logs was found.', async () => {
//       const ctx = new Context({
//         params: {
//           logsId: logs2.id
//         }
//       });
//       const response = await controller.findLogsById(ctx);

//       if (!isHttpResponseOK(response)) {
//         throw new Error('The returned value should be an HttpResponseOK object.');
//       }

//       strictEqual(response.body.id, logs2.id);
//       strictEqual(response.body.text, logs2.text);
//     });

//     it('should return an HttpResponseNotFound object if the logs was not found.', async () => {
//       const ctx = new Context({
//         params: {
//           logsId: -1
//         }
//       });
//       const response = await controller.findLogsById(ctx);

//       if (!isHttpResponseNotFound(response)) {
//         throw new Error('The returned value should be an HttpResponseNotFound object.');
//       }
//     });

//   });

//   describe('has a "createLogs" method that', () => {

//     it('should handle requests at POST /.', () => {
//       strictEqual(getHttpMethod(LogsController, 'createLogs'), 'POST');
//       strictEqual(getPath(LogsController, 'createLogs'), undefined);
//     });

//     it('should create the logs in the database and return it through '
//         + 'an HttpResponseCreated object.', async () => {
//       const ctx = new Context({
//         body: {
//           text: 'Logs 3',
//         }
//       });
//       const response = await controller.createLogs(ctx);

//       if (!isHttpResponseCreated(response)) {
//         throw new Error('The returned value should be an HttpResponseCreated object.');
//       }

//       const logs = await getRepository(Logs).findOne({ text: 'Logs 3' });

//       if (!logs) {
//         throw new Error('No logs 3 was found in the database.');
//       }

//       strictEqual(logs.text, 'Logs 3');

//       strictEqual(response.body.id, logs.id);
//       strictEqual(response.body.text, logs.text);
//     });

//   });

//   describe('has a "modifyLogs" method that', () => {

//     it('should handle requests at PATCH /:logsId.', () => {
//       strictEqual(getHttpMethod(LogsController, 'modifyLogs'), 'PATCH');
//       strictEqual(getPath(LogsController, 'modifyLogs'), '/:logsId');
//     });

//     it('should update the logs in the database and return it through an HttpResponseOK object.', async () => {
//       const ctx = new Context({
//         body: {
//           text: 'Logs 2 (version 2)',
//         },
//         params: {
//           logsId: logs2.id
//         }
//       });
//       const response = await controller.modifyLogs(ctx);

//       if (!isHttpResponseOK(response)) {
//         throw new Error('The returned value should be an HttpResponseOK object.');
//       }

//       const logs = await getRepository(Logs).findOne(logs2.id);

//       if (!logs) {
//         throw new Error();
//       }

//       strictEqual(logs.text, 'Logs 2 (version 2)');

//       strictEqual(response.body.id, logs.id);
//       strictEqual(response.body.text, logs.text);
//     });

//     it('should not update the other logss.', async () => {
//       const ctx = new Context({
//         body: {
//           text: 'Logs 2 (version 2)',
//         },
//         params: {
//           logsId: logs2.id
//         }
//       });
//       await controller.modifyLogs(ctx);

//       const logs = await getRepository(Logs).findOne(logs1.id);

//       if (!logs) {
//         throw new Error();
//       }

//       notStrictEqual(logs.text, 'Logs 2 (version 2)');
//     });

//     it('should return an HttpResponseNotFound if the object does not exist.', async () => {
//       const ctx = new Context({
//         body: {
//           text: '',
//         },
//         params: {
//           logsId: -1
//         }
//       });
//       const response = await controller.modifyLogs(ctx);

//       if (!isHttpResponseNotFound(response)) {
//         throw new Error('The returned value should be an HttpResponseNotFound object.');
//       }
//     });

//   });

//   describe('has a "replaceLogs" method that', () => {

//     it('should handle requests at PUT /:logsId.', () => {
//       strictEqual(getHttpMethod(LogsController, 'replaceLogs'), 'PUT');
//       strictEqual(getPath(LogsController, 'replaceLogs'), '/:logsId');
//     });

//     it('should update the logs in the database and return it through an HttpResponseOK object.', async () => {
//       const ctx = new Context({
//         body: {
//           text: 'Logs 2 (version 2)',
//         },
//         params: {
//           logsId: logs2.id
//         }
//       });
//       const response = await controller.replaceLogs(ctx);

//       if (!isHttpResponseOK(response)) {
//         throw new Error('The returned value should be an HttpResponseOK object.');
//       }

//       const logs = await getRepository(Logs).findOne(logs2.id);

//       if (!logs) {
//         throw new Error();
//       }

//       strictEqual(logs.text, 'Logs 2 (version 2)');

//       strictEqual(response.body.id, logs.id);
//       strictEqual(response.body.text, logs.text);
//     });

//     it('should not update the other logss.', async () => {
//       const ctx = new Context({
//         body: {
//           text: 'Logs 2 (version 2)',
//         },
//         params: {
//           logsId: logs2.id
//         }
//       });
//       await controller.replaceLogs(ctx);

//       const logs = await getRepository(Logs).findOne(logs1.id);

//       if (!logs) {
//         throw new Error();
//       }

//       notStrictEqual(logs.text, 'Logs 2 (version 2)');
//     });

//     it('should return an HttpResponseNotFound if the object does not exist.', async () => {
//       const ctx = new Context({
//         body: {
//           text: '',
//         },
//         params: {
//           logsId: -1
//         }
//       });
//       const response = await controller.replaceLogs(ctx);

//       if (!isHttpResponseNotFound(response)) {
//         throw new Error('The returned value should be an HttpResponseNotFound object.');
//       }
//     });

//   });

//   describe('has a "deleteLogs" method that', () => {

//     it('should handle requests at DELETE /:logsId.', () => {
//       strictEqual(getHttpMethod(LogsController, 'deleteLogs'), 'DELETE');
//       strictEqual(getPath(LogsController, 'deleteLogs'), '/:logsId');
//     });

//     it('should delete the logs and return an HttpResponseNoContent object.', async () => {
//       const ctx = new Context({
//         params: {
//           logsId: logs2.id
//         }
//       });
//       const response = await controller.deleteLogs(ctx);

//       if (!isHttpResponseNoContent(response)) {
//         throw new Error('The returned value should be an HttpResponseNoContent object.');
//       }

//       const logs = await getRepository(Logs).findOne(logs2.id);

//       strictEqual(logs, undefined);
//     });

//     it('should not delete the other logss.', async () => {
//       const ctx = new Context({
//         params: {
//           logsId: logs2.id
//         }
//       });
//       const response = await controller.deleteLogs(ctx);

//       if (!isHttpResponseNoContent(response)) {
//         throw new Error('The returned value should be an HttpResponseNoContent object.');
//       }

//       const logs = await getRepository(Logs).findOne(logs1.id);

//       notStrictEqual(logs, undefined);
//     });

//     it('should return an HttpResponseNotFound if the logs was not found.', async () => {
//       const ctx = new Context({
//         params: {
//           logsId: -1
//         }
//       });
//       const response = await controller.deleteLogs(ctx);

//       if (!isHttpResponseNotFound(response)) {
//         throw new Error('The returned value should be an HttpResponseNotFound object.');
//       }
//     });

//   });

// });
