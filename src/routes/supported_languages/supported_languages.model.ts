import { Type } from '@sinclair/typebox';
import { UUID } from '../../common/models';

export const SupportedLanguagesModel = Type.Object(
  {
    id: UUID,
    locale_long: Type.String({
      maxLength: 10,
      minLength: 1,
      title: 'The full representation of the language locale',
      examples: ['en-GB', 'en-US', 'af-ZA', 'ar-AE'],
    }),
    locale_short: Type.String({
      maxLength: 10,
      minLength: 1,
      title: 'The short representation of the language locale',
      examples: ['en', 'af', 'ar'],
    }),
  },
  {
    title: 'Model for supported language',
    description: 'Defines the data structure of a supported language',
  }
);
