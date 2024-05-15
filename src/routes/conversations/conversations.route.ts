import { FastifyInstance } from 'fastify';
import * as Handlers from './conversations.handlers';
import * as Schemas from './conversations.schemas';

export default async function conversationsRoutes(server: FastifyInstance) {
  server.get('/', { schema: Schemas.getAll }, Handlers.getAll);
  server.get('/:id', { schema: Schemas.getByID }, Handlers.getByID);
  server.get(
    '/audio/:id',
    { schema: Schemas.getAudioById },
    Handlers.getAudioById
  );
}

export const autoConfig = { name: 'conversations-routes' };
