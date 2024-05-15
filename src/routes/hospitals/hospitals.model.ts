import { Type } from '@sinclair/typebox';

export const HospitalDepartmentModel = Type.Object({
  id: Type.String({
    format: 'uuid',
    minLength: 36,
    maxLength: 36,
    title: "The hospital's department unique identifier",
  }),
  name: Type.String({
    minLength: 2,
    maxLength: 64,
    title: "The hospital's department name",
  }),
});

export const HospitalModel = Type.Object({
  id: Type.String({
    format: 'uuid',
    minLength: 36,
    maxLength: 36,
    title: "The hospital's unique identifier",
  }),
  name: Type.String({
    minLength: 2,
    maxLength: 64,
    title: "The hospital's name",
  }),
});
