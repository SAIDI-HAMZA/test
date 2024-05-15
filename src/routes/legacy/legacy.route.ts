import { FastifyInstance } from 'fastify';
import * as Handlers from './legacy.handlers';
import * as Schemas from './legacy.schemas';

export default async function legacyRoutes(server: FastifyInstance) {
  server.post(
    '/conversations/create',
    { schema: Schemas.createConversation },
    Handlers.createConversation
  );
  server.post(
    '/device/pair',
    { schema: Schemas.pairDevice },
    Handlers.pairDevice
  );
}

export const autoConfig = { name: 'legacy-routes' };
