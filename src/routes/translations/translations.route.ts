import { FastifyInstance } from 'fastify';
import * as Handlers from './translations.handlers';

export default async function translationsRoutes(server: FastifyInstance) {
  server.post('/audio-to-text', Handlers.AudioTranslation);
  server.post('/text-to-audio', Handlers.TextTranslation);
  server.post('/streaming-audio', Handlers.StreamTranslation);
}

export const autoConfig = { name: 'translations-routes' };
