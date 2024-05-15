import Fastify, { FastifyRequest } from 'fastify';
import env from '@fastify/env';
import autoload from '@fastify/autoload';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import jwt, { FastifyJWT } from '@fastify/jwt';
import cors from '@fastify/cors';
import buildGetJwks from 'get-jwks';
import {
  TypeBoxTypeProvider,
  TypeBoxValidatorCompiler,
} from '@fastify/type-provider-typebox';
import * as config from './src/config';
import logger from './src/log';
import errorHandler from './src/errors';
import './src/formats';

const server = Fastify({
  logger,
  requestTimeout: 30000,
})
  .withTypeProvider<TypeBoxTypeProvider>()
  .setValidatorCompiler(TypeBoxValidatorCompiler);

export type ServerInstance = typeof server;

server.register(require('@fastify/multipart'));

// register env plugin
server.register(env, config.env).after(err => {
  if (err) {
    server.log.info(`Failed to register env plugin: ${err}`);
    process.exit(1);
  } else {
    server.log.info('Successfuly registered env plugin');
  }
});

// register swagger plugin
server.register(swagger, config.swagger).after(err => {
  if (err) {
    server.log.info(`Failed to register swagger plugin: ${err}`);
    process.exit(1);
  } else {
    server.log.info('Successfuly registered swagger plugin');
  }
});

// register swagger-ui plugin
server.register(swaggerUi, config.swaggerUi).after(err => {
  if (err) {
    server.log.info(`Failed to register swagger-ui plugin: ${err}`);
    process.exit(1);
  } else {
    server.log.info('Successfuly registered swagger-ui plugin');
  }
});

// register autoload (for routes) plugin
server.register(autoload, config.routesAutoload).after(err => {
  if (err) {
    server.log.info(`Failed to register routesAutoload plugin: ${err}`);
    process.exit(1);
  } else {
    server.log.info('Successfuly registered routesAutoload plugin');
  }
});

// register autoload (for plugins) plugin
server.register(autoload, config.pluginsAutoload).after(err => {
  if (err) {
    server.log.fatal(`Failed to register pluginsAutoload plugin: ${err}`);
    process.exit(1);
  } else {
    server.log.info('Successfuly registered pluginsAutoload plugin');
  }
});

const getJwks = buildGetJwks({
  jwksPath: 'keys',
});

// register jwt plugin
server
  .register(jwt, {
    // FIXME: try to find the correct typings
    secret: async (_request: FastifyRequest, token: unknown) => {
      try {
        let {
          // eslint-disable-next-line prefer-const
          header: { kid, alg },
          payload: { iss },
        } = token as FastifyJWT;
        iss = iss.substring(0, iss.length - 5);
        iss += '/discovery';

        return await getJwks.getPublicKey({
          kid,
          domain: iss,
          alg,
        });
      } catch (err) {
        server.log.error('Error getting public key: ', err);
      }
    },
    decode: {
      complete: true,
    },
    formatUser: payload => {
      return {
        email: payload.preferred_username,
      };
    },
  })
  .after(err => {
    if (err) {
      server.log.error('Failed to register jwt plugin');
    } else {
      server.log.info('Successfuly registered jwt plugin');
    }
  });

// register cors plugin
server.register(cors, config.cors).after(err => {
  if (err) {
    server.log.info('Failed to register cors plugin');
  } else {
    server.log.info('Successfuly registered cors plugin');
  }
});

// configure error handler
server.setErrorHandler(errorHandler);

// configure 404 handler
server.setNotFoundHandler(
  {
    preValidation: (req, reply, done) => {
      done();
    },
    preHandler: (req, reply, done) => {
      done();
    },
  },
  (request, reply) => {
    server.log.info(
      `404 not found : ${request.method} ${request.routerPath || request.url}`
    );
    reply.code(401);
    reply.send({
      message: 'unauthorized',
    });
  }
);

// all plugins loaded
server.ready(err => {
  if (err) throw err;
  server.listen({
    host: '0.0.0.0',
    port: 8080,
  });
});
