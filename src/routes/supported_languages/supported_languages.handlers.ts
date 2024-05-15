import { RouteHandler } from '../../types/route';
import * as Schemas from './supported_languages.schemas';

export const getAll: RouteHandler<typeof Schemas.getAll> = async (req, res) => {
  const languages = await req.server.prisma.supportedLanguage.findMany();
  res.code(200).send({
    content: languages,
  });
};
