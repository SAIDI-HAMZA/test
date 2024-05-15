import { RouteHandler } from '../../types/route';
import * as Schemas from './hospitals.schemas';

export const getDepartments: RouteHandler<
  typeof Schemas.getDepartments
> = async (req, res) => {
  try {
    if (req.query && req.query.hospital_id) {
      const departments = await req.server.prisma.hospitalDepartment.findMany({
        where: {
          hospital_id: req.query.hospital_id,
          hospital: {
            activated: true,
          },
        },
        select: {
          id: true,
          name: true,
        },
      });
      return res.code(200).send({
        content: departments,
      });
    } else {
      const hospitals = await req.server.prisma.hospital.findMany({
        where: {
          activated: true,
        },
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
      return res.code(200).send({
        content: hospitals,
      });
    }
  } catch (err) {
    req.server.log.error(err);
  }
};
