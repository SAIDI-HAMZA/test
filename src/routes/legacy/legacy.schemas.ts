import { Type } from '@fastify/type-provider-typebox';
import {
  Generic200Response,
  Generic400Response,
  Generic422Response,
} from '../../models/response';
import {
  HospitalDepartmentModel,
  HospitalModel,
} from '../hospitals/hospitals.model';
import { LegacyConversationModel } from './legacy.model';

export const createConversation = {
  tags: ['Legacy'],
  body: Type.Object({
    conversations: Type.Array(LegacyConversationModel, {
      minItems: 1,
      title:
        'An array of conversation lines lines, forming a whole conversation',
      description:
        'The array is created from the application once the conversation is finished',
    }),
    tabletUniqueKey: Type.String({
      format: 'android-unique-id',
      maxLength: 16,
      minLength: 16,
      title: "The device's unique ID",
      description:
        'Provided by the Android system, the uniqueID is a 16 long hexadecimal string',
    }),
  }),
  response: {
    200: Type.Intersect([
      Generic200Response,
      Type.Object({
        hospital: HospitalModel,
        department: HospitalDepartmentModel,
      }),
    ]),
    400: Type.Intersect([Generic400Response]),
    422: Type.Intersect([Generic422Response]),
  },
};

export const pairDevice = {
  tags: ['Legacy'],
  body: Type.Object({
    associationCode: Type.String({
      title: 'Device pairing code',
      description:
        "Code is set to be used ones (i.e. it's a onetime password). This code associate the real device to it's record in database. This ensure that only one device can be linked to a record.",
      minimum: 6,
      maximum: 6,
    }),
    tabletUniqueKey: Type.String({
      format: 'android-unique-id',
      maxLength: 16,
      minLength: 16,
      title: "The device's unique ID",
      description:
        'Provided by the Android system, the uniqueID is a 16 long hexadecimal string',
    }),
    name: Type.Optional(
      Type.String({
        minLength: 1,
        title: "The device's name",
      })
    ),
  }),
  response: {
    200: Type.Object({
      hospitalName: HospitalModel.properties.name,
      serviceName: HospitalDepartmentModel.properties.name,
    }),
    400: Type.Intersect([Generic400Response]),
    422: Type.Intersect([Generic422Response]),
  },
};
