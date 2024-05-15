import { SwaggerOptions } from '@fastify/swagger';

const config: SwaggerOptions = {
  mode: 'dynamic',
  openapi: {
    info: {
      title: 'Hospeech API documentation',
      description:
        'This documentation provides information on how the Hospeech API works',
      version: '0.1.0',
    },
    tags: [
      { name: 'Health', description: 'Health checks related routes' },
      {
        name: 'Users',
        description: 'Users related routes',
      },
    ],
  },
};

export { config as swagger };
