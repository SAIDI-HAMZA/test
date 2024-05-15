import { Type } from '@sinclair/typebox';
import { Generic200Response, Generic500Response } from '../../models/response';
import { TranslationAudioModel } from './translations.model';

export const translationAudio = {
  tags: ['Translations'],
  description: 'Audion translation',
  consumes: ['multipart/form-data'],
  body: TranslationAudioModel,
  response: {
    200: Type.Intersect([
      Generic200Response,
      Type.Object({
        content: Type.Array(
          Type.Intersect([
            TranslationAudioModel,
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
          ])
        ),
      }),
    ]),
    500: Generic500Response,
  },
};
