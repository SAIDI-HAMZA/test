import { Type } from '@sinclair/typebox';
import {
  Generic200Response,
  Generic500Response,
  Generic504Response,
} from '../../models/response';

export const isAlive = {
  description: 'Health check route',
  summary:
    'Runs a health check on the service to see if the api is responding correctly.',
  tags: ['Health'],
  response: {
    200: Type.Intersect([
      Type.Omit(Generic200Response, ['content']),
      Type.Object({
        message: Type.Strict(
          Type.String({
            default: 'alive',
            examples: ['alive'],
          })
        ),
      }),
    ]),
    504: Generic504Response,
    500: Generic500Response,
  },
};
