import { FastifyInstance } from 'fastify';
import * as Handlers from './health.handlers';
import * as Schemas from './health.schemas';

export default async function healthRoutes(server: FastifyInstance) {
  server.get('/', { schema: Schemas.isAlive }, Handlers.isAlive);
}

export const autoConfig = { name: 'health-routes' };
