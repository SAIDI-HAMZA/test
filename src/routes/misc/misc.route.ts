import { FastifyInstance } from 'fastify';
import * as Handlers from './misc.handlers';
import * as Schemas from './misc.schemas';

export default async function miscRoutes(server: FastifyInstance) {
  server.get(
    '/data-lists',
    { schema: Schemas.getDataLists },
    Handlers.getDataLists
  );
}

export const autoConfig = { name: 'misc-routes' };
