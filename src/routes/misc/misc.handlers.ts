import { RouteHandler } from '../../types/route';
import * as Schemas from './misc.schemas';

export const getDataLists: RouteHandler<typeof Schemas.getDataLists> = async (
  req,
  res
) => {
  const content: (typeof Schemas.getDataLists.response)['200']['static']['content'] =
    {};
  try {
    if (req.query.hospitals === true) {
      const hospitals = await req.server.prisma.hospital.findMany({
        select: {
          id: true,
          name: true,
          departments: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
      content.hospitals = hospitals;
    }
    if (req.query.languages === true) {
      const languages = await req.server.prisma.supportedLanguage.findMany({
        select: {
          id: true,
          locale_long: true,
          locale_short: true,
        },
      });
      content.languages = languages;
    }
    res.code(200).send({ content });
  } catch (e) {
    throw new Error(e as string);
  }
};
