import { Type } from '@fastify/type-provider-typebox';

const GenericContent = Type.Strict(
  Type.Union([Type.Array(Type.Object({})), Type.Object({}), Type.Null()])
);

const Generic200Response = Type.Object(
  {
    content: GenericContent,
  },
  {
    title: 'The request was handled properly. The response sends back content.',
  }
);

const Generic201Response = Type.Object(
  {
    content: GenericContent,
  },
  {
    title: 'The resource was created and something can be sent back.',
  }
);

const Generic204Response = Type.Object(
  {
    content: Type.Strict(Type.Null()),
  },
  { title: 'Nothing is sent back' }
);

const Generic400Response = Type.Object(
  {
    message: Type.String({
      default: 'bad_request',
      examples: [
        'bad_request',
        'missing_parameter:user_name',
        'malformed_parameter:user_name',
      ],
    }),
  },
  {
    description: 'Either the body or the request itself is malformed.',
    title: 'The request was malformed.',
  }
);

const Generic401Response = Type.Object(
  {
    message: Type.Strict(
      Type.String({
        default: 'unauthorized',
        examples: ['unauthorized'],
      })
    ),
  },
  {
    title: 'The user is not authorized to access the route.',
  }
);

const Generic404Response = Type.Object(
  {
    message: Type.String({
      default: 'resource_not_found',
      examples: ['user_not_found', 'conversation_not_found'],
    }),
  },
  {
    title: 'The resource was not found.',
    description: 'The requested item was not found.',
  }
);

const Generic422Response = Type.Object(
  {
    message: Type.String({
      default: 'unprocessable_entity',
      examples: ['unprocessable_entity'],
      title: 'The message indicating what went wrong.',
    }),
  },
  {
    description: 'The resource could not be handled properly.',
    title: '422 Unprocessable entity',
  }
);

const Generic500Response = Type.Object(
  {
    message: Type.String({
      default: 'unhandled_error',
      examples: ['unhandled_error', 'unknown_error'],
    }),
  },
  {
    title: 'Something went wrong.',
    description: 'An error occurred and could not be handled or is not known.',
  }
);

const Generic504Response = Type.Object(
  {
    message: Type.String({
      default: 'timeout',
      examples: ['timeout'],
    }),
  },
  {
    description: 'The request or gateway has timed-out',
    title: 'Gateway timeout',
  }
);

export {
  Generic200Response,
  Generic201Response,
  Generic204Response,
  Generic400Response,
  Generic401Response,
  Generic404Response,
  Generic422Response,
  Generic500Response,
  Generic504Response,
  GenericContent,
};
