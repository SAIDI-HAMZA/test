import { FastifyInstance } from 'fastify';
import * as Handlers from './users.handlers';
import * as Schemas from './users.schemas';

export default async function usersRoutes(server: FastifyInstance) {
  server.post('/profile', { schema: Schemas.signUp }, Handlers.signUp);
  server.patch(
    '/profile',
    { schema: Schemas.editProfile },
    Handlers.editProfile
  );
  server.get('/profile', { schema: Schemas.getProfile }, Handlers.getProfile);
}

export const autoConfig = { name: 'users-routes' };
