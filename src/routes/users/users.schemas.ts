import { Type } from '@sinclair/typebox';
import {
  Generic200Response,
  Generic400Response,
  Generic401Response,
  Generic404Response,
  Generic422Response,
  Generic500Response,
} from '../../models/response';
import { UserModel } from './users.model';

export const signUp = {
  tags: ['Users'],
  description:
    'Allow an authenticated user to sign-up and complete its profile',
  body: Type.Object(
    {
      ...Type.Pick(UserModel, [
        'job',
        'first_name',
        'last_name',
        'user_name',
        'spoken_languages',
      ]).properties,
      department: Type.String({
        format: 'uuid',
        minLength: 36,
        maxLength: 36,
        title: 'The department the user is in.',
        description: 'Given by another route. Must be the department ID',
      }),
    },
    {
      additionalProperties: false,
    }
  ),
  response: {
    200: Type.Intersect([
      Generic200Response,
      Type.Object({
        content: Type.Omit(UserModel, ['access_roles', 'conversations']),
        exists: Type.Boolean({
          default: false,
          title: 'Wether the user exists in the database',
          description:
            'This info is used in the front-end to decide if the user must complete its profile.',
        }),
      }),
    ]),
    400: Generic400Response,
    422: Type.Intersect([
      Generic422Response,
      Type.Object({
        message: Type.String({
          default: 'user_already_exists',
          examples: ['user_already_exists'],
        }),
      }),
    ]),
    500: Generic500Response,
  },
};

export const getProfile = {
  tags: ['Users'],
  description: 'Retrieve the user profile based on the JWT',
  response: {
    200: Type.Intersect([
      Generic200Response,
      Type.Object({
        content: Type.Partial(
          Type.Omit(UserModel, ['access_roles', 'conversations'])
        ),
        exists: Type.Boolean({
          default: false,
          title: 'Wether the user exists in the database',
          description:
            'This info is used in the front-end to decide if the user must complete its profile.',
        }),
      }),
    ]),
    401: Generic401Response,
    404: Generic404Response,
  },
};

export const editProfile = {
  tags: ['Users'],
  description: "Change the user's properties.",
  body: Type.Partial(
    Type.Object(
      {
        ...Type.Pick(UserModel, [
          'job',
          'first_name',
          'last_name',
          'user_name',
          'spoken_languages',
        ]).properties,
        department: Type.String({
          format: 'uuid',
          minLength: 36,
          maxLength: 36,
          title: 'The department the user is in.',
          description: 'Given by another route. Must be the department ID',
        }),
      },
      {
        additionalProperties: false,
      }
    ),
    {
      additionalProperties: false,
    }
  ),
  response: {
    200: Type.Intersect([
      Generic200Response,
      Type.Object({
        content: Type.Omit(UserModel, ['access_roles', 'conversations']),
      }),
    ]),
    401: Generic401Response,
    404: Generic404Response,
  },
};
