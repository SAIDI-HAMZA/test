import { FastifySwaggerUiOptions } from '@fastify/swagger-ui';

const config: FastifySwaggerUiOptions = {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'list',
    deepLinking: false,
  },
  uiHooks: {
    onRequest: function (request, reply, next) {
      next();
    },
    preHandler: function (request, reply, next) {
      next();
    },
  },
  staticCSP: true,
  initOAuth: {},
  transformStaticCSP: header => header,
};

export { config as swaggerUi };
