import { ServerInstance } from '../..';
import { isPrismaError, prismaErrorHandler } from './prisma.errors';

export const handle: ServerInstance['errorHandler'] = (error, req, res) => {
  let code = 500;
  let message = 'unhandled_error';

  // Check if error is a SyntaxError from the malformed body of a request
  if (
    (error instanceof SyntaxError ||
      error.code === 'FST_ERR_CTP_EMPTY_JSON_BODY') &&
    req.body === undefined &&
    (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH')
  ) {
    code = 400;
    message = 'malformed_body';
  }

  // Check if error is an schema validation error
  if (error.validation && error.validationContext === 'body') {
    const context = error.validation[0];
    if (context.message && context.message.startsWith('Expected object')) {
      code = 400;
      message = 'body_must_be_an_object';
    }
    if (context.message && context.message.startsWith('Unexpected')) {
      code = 400;
      message = 'bad_request';
      return res.code(code).send({
        message,
      });
    }
    if (
      context.instancePath &&
      req.body &&
      !Object.keys(req.body).includes(context.instancePath.replace('/', ''))
    ) {
      code = 400;
      message = `missing_parameter:${context.instancePath.replace('/', '')}`;
    }
    if (
      context.instancePath &&
      req.body &&
      Object.keys(req.body).includes(context.instancePath.replace('/', ''))
    ) {
      code = 422;
      message = `malformed_parameter:${context.instancePath.replace('/', '')}`;
    }
  }

  // Check if error is an authorization error
  if (error.statusCode === 401) {
    return res.code(401).send({
      message: 'unauthorized',
    });
  }

  // Check if error is an orm error
  if (isPrismaError(error)) {
    const prismaError = prismaErrorHandler(error);
    if (prismaError) {
      message = prismaError.message;
      code = prismaError.code;
    }
  }

  req.server.log.error(error);

  return res.code(code).send({
    message,
  });
};
