import { Type } from '@sinclair/typebox';
import { UUID } from '../../common/models';
import { SupportedLanguagesModel } from '../supported_languages/supported_languages.model';

export const ConversationLineModel = Type.Object(
  {
    id: UUID,
    audio: Type.Union([UUID, Type.Null()]),
    translated_text: Type.String({
      minLength: 1,
      title: 'The translated bit of the conversation',
      description: 'Translated by sdk',
      examples: ["Hello I'm Dr Joseph"],
    }),
    original_text: Type.String({
      minLength: 1,
      title: 'The original, not translated bit of the conversation',
      description: 'Recorded by user',
      examples: ['Bonjour, je suis le docteur Joseph'],
    }),
    speaker: Type.Enum(
      {
        PATIENT: 'PATIENT',
        MEDICAL_TEAM: 'MEDICAL_TEAM',
      },
      {
        title: 'Who initiated this part of the conversation',
        description: "Wether it's the doctor or patient who speaks",
      }
    ),
    added_at: Type.Unsafe<Date>({
      format: 'date-time',
      type: 'string',
      title: 'The date at which the line was added to the conversation',
      description: 'By default is the current time & date',
    }),
    conversation_id: UUID,
    locale: Type.Omit(SupportedLanguagesModel, ['id']),
  },
  {
    title: 'Conversation line model',
    description: 'A line of a conversation stored in the database',
  }
);

export const ConversationModel = Type.Object(
  {
    id: UUID,
    started_at: Type.Unsafe<Date>({
      format: 'date-time',
      type: 'string',
      title: 'The date at which the conversation started',
    }),
    ended_at: Type.Unsafe<Date>({
      format: 'date-time',
      type: 'string',
      title: 'The date at which the conversation ended',
    }),
    updated_at: Type.Unsafe<Date>({
      format: 'date-time',
      type: 'string',
      title: 'The date at which the conversation was updated last',
    }),
    accurate: Type.Boolean({
      title: 'A indicator of the accuracy of the automated translations',
      description: 'Can be turned on/off on the app',
      default: true,
    }),
    review_due_date: Type.Unsafe<Date>({
      format: 'date-time',
      type: 'string',
      title: 'The date at which the conversation is due to be reviewed',
      description: 'Default is 3 days after the conversation was created',
    }),
    lines: Type.Array(Type.Omit(ConversationLineModel, ['conversation_id'])),
  },
  {
    description: 'A conversation model stored in the database',
    title: 'Conversation model',
  }
);

export const ConversationAudioModel = Type.Object({
  id: UUID,
  audio_path: Type.String({
    format: 'base64',
    title: 'The audio base64 string (for now).',
  }),
});
