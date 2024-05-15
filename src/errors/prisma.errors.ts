import { FastifyError } from 'fastify';
import {
  PrismaClientRustPanicError,
  PrismaClientValidationError,
  PrismaClientKnownRequestError,
  PrismaClientInitializationError,
  PrismaClientUnknownRequestError,
} from '@prisma/client/runtime/library';

type ErrorHandlerReturnType = {
  message: string;
  code: number;
} | null;

export const isPrismaError = (error: Error) =>
  error instanceof PrismaClientRustPanicError ||
  error instanceof PrismaClientValidationError ||
  error instanceof PrismaClientKnownRequestError ||
  error instanceof PrismaClientInitializationError ||
  error instanceof PrismaClientUnknownRequestError;

export const prismaErrorHandler: (
  error: FastifyError
) => ErrorHandlerReturnType = error => {
  if (!error) {
    return null;
  }

  if (error instanceof PrismaClientRustPanicError) {
    return {
      message: 'prisma_client_rust_panic_error',
      code: 500,
    };
  } else if (error instanceof PrismaClientValidationError) {
    return {
      message: 'prisma_client_validation_error',
      code: 500,
    };
  } else if (error instanceof PrismaClientKnownRequestError) {
    return {
      message: 'prisma_client_known_request_error',
      code: 500,
    };
  } else if (error instanceof PrismaClientInitializationError) {
    return {
      message: 'prisma_client_initialization_error',
      code: 500,
    };
  } else if (error instanceof PrismaClientUnknownRequestError) {
    return {
      message: 'prisma_client_unknown_request_error',
      code: 500,
    };
  }
  return {
    message: 'unhandled_orm_error',
    code: 500,
  };
};
