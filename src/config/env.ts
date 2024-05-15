import { FastifyEnvOptions } from '@fastify/env';

const schema = {
  type: 'object',
  required: ['PORT', 'HOST'],
  properties: {
    PORT: {
      type: 'number',
      default: 3000,
    },
    HOST: {
      type: 'string',
      default: '127.0.0.1',
    },
  },
};

const config: FastifyEnvOptions = {
  confKey: 'env',
  schema,
};

export { config as env };
