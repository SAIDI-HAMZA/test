import { FastifyCorsOptions } from '@fastify/cors';

const config: FastifyCorsOptions = {
  origin: '*',
  hook: 'onRequest',
};

export { config as cors };
