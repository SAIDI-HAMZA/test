import { Type } from '@sinclair/typebox';
import { Generic200Response } from '../../models/response';
import { SupportedLanguagesModel } from './supported_languages.model';

export const getAll = {
  tags: ['Supported languages'],
  response: {
    200: Type.Intersect([
      Generic200Response,
      Type.Object({
        content: Type.Array(SupportedLanguagesModel),
      }),
    ]),
  },
};
