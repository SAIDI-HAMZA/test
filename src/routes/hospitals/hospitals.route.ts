import { FastifyInstance } from 'fastify';
import * as Handlers from './hospitals.handlers';
import * as Schemas from './hospitals.schemas';

export default async function hospitalsRoutes(server: FastifyInstance) {
  server.get(
    '/departments',
    { schema: Schemas.getDepartments },
    Handlers.getDepartments
  );
}

export const autoConfig = { name: 'hospitals-routes' };
