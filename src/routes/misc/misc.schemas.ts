import { Type } from '@fastify/type-provider-typebox';
import {
  Generic200Response,
  Generic400Response,
  Generic500Response,
} from '../../models/response';
import {
  HospitalDepartmentModel,
  HospitalModel,
} from '../hospitals/hospitals.model';
import { SupportedLanguagesModel } from '../supported_languages/supported_languages.model';

export const getDataLists = {
  tags: ['Misc'],
  querystring: Type.Object({
    hospitals: Type.Optional(
      Type.Boolean({
        default: false,
        title: 'Require hospital',
        description: 'Requires hospitals to be sent back in the reponse',
      })
    ),
    languages: Type.Optional(
      Type.Boolean({
        default: false,
        title: 'Require languages',
        description: 'Requires languages to be sent back in the reponse',
      })
    ),
  }),
  response: {
    200: Type.Intersect([
      Generic200Response,
      Type.Object({
        content: Type.Object({
          hospitals: Type.Optional(
            Type.Array(
              Type.Intersect([
                HospitalModel,
                Type.Object({
                  departments: Type.Array(HospitalDepartmentModel),
                }),
              ])
            )
          ),
          languages: Type.Optional(Type.Array(SupportedLanguagesModel)),
        }),
      }),
    ]),
    400: Generic400Response,
    500: Generic500Response,
  },
};
