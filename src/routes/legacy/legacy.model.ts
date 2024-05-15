import { Type } from '@fastify/type-provider-typebox';

export const LegacyConversationModel = Type.Object({
  original: Type.String({
    minLength: 1,
    title: 'The untranslated text of the part of the conversation',
  }),
  traduction: Type.String({
    minLength: 1,
    title: 'The translated text of the part of the conversation',
  }),
  audioFile: Type.Union([Type.Null(), Type.String()], {
    title: 'The audio bytes from the part of the conversation',
  }),
  professional: Type.Boolean({
    title: "I don't actually know",
  }),
  language: Type.String({
    title: 'The language locale used for this part of the conversation',
    description: 'Can be either the patient language',
  }),
  timestamp: Type.Number({
    title: 'Timestamp of the line',
    description: 'Date of creation of the line on the epoch format',
  }),
});
