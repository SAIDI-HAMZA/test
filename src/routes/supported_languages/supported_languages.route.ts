import { FastifyInstance } from 'fastify';
import * as Handlers from './supported_languages.handlers';
import * as Schemas from './supported_languages.schemas';

export default async function supportedLanguageRoutes(server: FastifyInstance) {
  server.get('/', { schema: Schemas.getAll }, Handlers.getAll);
}

export const autoConfig = { name: 'hospitals-routes' };
