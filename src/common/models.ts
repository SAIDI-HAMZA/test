import { Type } from '@sinclair/typebox';

export const UUID = Type.String({
  format: 'uuid',
  minLength: 36,
  maxLength: 36,
  title: "The resource's unique identifier",
  description: 'Used to identify the resource in the database',
});
