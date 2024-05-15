import { Type } from '@sinclair/typebox';

export const TranslationAudioModel = Type.Object({
  originalLanguage: Type.Object({
    value: Type.String(),
  }),
  targetLanguage: Type.Object({
    value: Type.String(),
  }),
  file: Type.Object({
    //isFile:Type.Literal(true),
    encoding: Type.String(),
    filename: Type.String(),
    mimetype: Type.Optional(Type.String()),
    file: Type.Any(), //any better way??
    type: Type.Optional(Type.String()),
  }),
});
//export type TranslationAudioModelType = Static<typeof TranslationAudioModel>;
