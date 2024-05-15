import { Type } from '@sinclair/typebox';
import { Generic200Response, Generic404Response } from '../../models/response';
import { HospitalDepartmentModel, HospitalModel } from './hospitals.model';

export const getDepartments = {
  tags: ['Hospitals'],
  summary: 'Get hospital departments',
  description:
    'Get a list of hospitals and their departments. Can also add a query parameter to get departments of a specific hospital.',
  querystring: Type.Object(
    {
      hospital_id: Type.Optional(
        Type.String({
          format: 'uuid',
          title: "The hospital's id",
          minLength: 36,
          maxLength: 36,
        })
      ),
    },
    {
      additionalProperties: false,
    }
  ),
  response: {
    200: Type.Intersect([
      Generic200Response,
      Type.Object({
        content: Type.Array(
          Type.Object({
            ...Type.Pick(HospitalModel, ['id', 'name']).properties,
            departments: Type.Optional(Type.Array(HospitalDepartmentModel)),
          })
        ),
      }),
    ]),
    404: Generic404Response,
  },
};
