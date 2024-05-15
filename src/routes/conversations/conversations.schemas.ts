import { Type } from '@sinclair/typebox';
import {
  Generic200Response,
  Generic404Response,
  Generic500Response,
} from '../../models/response';
import { UUID } from '../../common/models';
import {
  HospitalDepartmentModel,
  HospitalModel,
} from '../hospitals/hospitals.model';
import { ConversationModel } from './conversations.model';

export const getAll = {
  tags: ['Conversations'],
  description: 'Get a list of conversations',
  querystring: Type.Object(
    {
      languages: Type.Optional(
        Type.Union([
          Type.Array(UUID, {
            uniqueItems: true,
          }),
          UUID,
        ])
      ),
    },
    {
      title: 'Filters',
      description: 'These filters will be put directly under the orm.',
      additionalProperties: false,
    }
  ),
  response: {
    200: Type.Intersect([
      Generic200Response,
      Type.Object({
        content: Type.Array(
          Type.Omit(
            Type.Intersect([
              ConversationModel,
              Type.Object({
                preview_translated_text: Type.Union([
                  Type.String({
                    title:
                      'The preview of the first bit of the translated conversation',
                    description: 'Truncated at 50 characters',
                  }),
                  Type.Null(),
                ]),
                preview_original_text: Type.Union([
                  Type.String({
                    title:
                      'The preview of the first bit of the original conversation',
                    description: 'Truncated at 50 characters',
                  }),
                  Type.Null(),
                ]),
                language: Type.Union([
                  Type.Null(),
                  Type.String({
                    title: 'The global language of the conversation',
                    description: 'Computed from the lines of the conversation',
                  }),
                ]),
              }),
            ]),
            ['lines']
          )
        ),
      }),
    ]),
    500: Generic500Response,
  },
};

export const getByID = {
  tags: ['Conversations'],
  description: 'Get a conversation by ID',
  params: Type.Object({
    id: UUID,
  }),
  response: {
    200: Type.Intersect([
      Generic200Response,
      Type.Object({
        content: Type.Intersect([
          ConversationModel,
          Type.Object({
            department: HospitalDepartmentModel,
            hospital: HospitalModel,
            language: Type.Union([
              Type.Null(),
              Type.String({
                title: 'The global language of the conversation',
                description: 'Computed from the lines of the conversation',
              }),
            ]),
            device_name: Type.String({
              title: "The device's name on which the conversation was made",
              description: 'Set by user',
            }),
            display_id: Type.Number({
              title: 'An ID to be displayed in the front-end',
              description: 'auto-increments in db',
            }),
          }),
        ]),
      }),
    ]),
    404: Generic404Response,
    500: Generic500Response,
  },
};

export const getAudioById = {
  tags: ['Conversations'],
  summary: 'Get an audio file from a conversation',
  description: "Get a conversation's audio by ID",
  params: Type.Object({
    id: UUID,
  }),
  querystring: Type.Object({
    token: Type.String({ minLength: 1 }),
  }),
  produces: ['application/json', 'audio/mp3'],
  response: {
    200: Type.String({
      format: 'binary',
      contentEncoding: 'binary',
      contentMediaType: 'audio/mp3',
    }),
    404: Generic404Response,
    500: Generic500Response,
  },
};
