import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { RouteHandler } from '../../types/route';
import * as Schemas from './users.schemas';

export const signUp: RouteHandler<typeof Schemas.signUp> = async (req, res) => {
  const user = req.user;
  try {
    const departmentExists =
      await req.server.prisma.hospitalDepartment.findFirst({
        where: {
          id: req.body.department,
        },
        select: {
          hospital: true,
        },
      });
    if (!departmentExists) {
      return res.code(404).send({
        message: 'department_not_found',
      });
    }
    if (departmentExists.hospital.activated === false) {
      return res.code(422).send({
        message: 'hospital_deactivated',
      });
    }
    const languages = await req.server.prisma.supportedLanguage.findMany({
      where: {
        id: {
          in: req.body.spoken_languages,
        },
      },
    });
    if (languages.length === 0) {
      return res.code(400).send({
        message: 'language_not_found',
      });
    }
    const dbUser = await req.server.prisma.user.create({
      data: {
        email: user.email,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        job: req.body.job,
        access_roles: ['ADMIN'],
        hospital_department_id: req.body.department,
        user_name: req.body.user_name,
        spoken_languages: languages.map(item => item.id),
      },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        job: true,
        user_name: true,
        spoken_languages: true,
        hospital_department: {
          select: {
            id: true,
            name: true,
            hospital: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
    const {
      hospital_department: { id, name, hospital },
    } = dbUser;
    return res.code(200).send({
      content: {
        ...dbUser,
        department: { id, name },
        hospital,
        spoken_languages: languages.map(l => l.id),
      },
      exists: true,
    });
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      if (err.code === 'P2002' && err.meta?.target) {
        if ((err.meta.target as string[])[0] === 'email') {
          return res.code(422).send({
            message: 'user_already_exists',
          });
        }
      }
    }
    throw err;
  }
};

export const getProfile: RouteHandler<typeof Schemas.getProfile> = async (
  req,
  res
) => {
  const user = req.user;
  if (user.email === undefined) {
    return res.code(401).send({
      message: 'unauthorized',
    });
  }
  const dbUser = await req.server.prisma.user.findFirst({
    where: {
      email: user.email,
    },
    select: {
      id: true,
      email: true,
      first_name: true,
      last_name: true,
      job: true,
      user_name: true,
      hospital_department: {
        select: {
          id: true,
          name: true,
          hospital: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      spoken_languages: true,
    },
  });
  if (dbUser === null) {
    res.code(200).send({
      exists: false,
      content: {
        email: req.user.email,
      },
    });
  } else {
    const languages = await req.server.prisma.supportedLanguage.findMany({
      where: {
        id: {
          in: dbUser?.spoken_languages,
        },
      },
    });
    const {
      id,
      email,
      first_name,
      last_name,
      job,
      user_name,
      hospital_department: department,
    } = dbUser;
    return res.code(200).send({
      exists: true,
      content: {
        id,
        email,
        first_name,
        last_name,
        job,
        user_name,
        department: {
          id: department.id,
          name: department.name,
        },
        hospital: department.hospital,
        spoken_languages: languages.map(l => l.id),
      },
    });
  }
};

const authorizedProperties = [
  'first_name',
  'last_name',
  'job',
  'department',
  'user_name',
  'spoken_languages',
];

export const editProfile: RouteHandler<typeof Schemas.editProfile> = async (
  req,
  res
) => {
  const user = await req.server.prisma.user.findFirst({
    where: {
      email: req.user.email,
    },
  });
  if (!user) {
    return res.code(404).send({
      message: 'user_not_found',
    });
  }
  const cleanUserBody = Object.entries(req.body).filter(
    item =>
      authorizedProperties.includes(item[0]) &&
      item[1] !== user[item[0] as keyof typeof user]
  );
  if (cleanUserBody.length === 0) {
    return res.code(400).send({
      message: 'unacceptable_properties',
    });
  }
  const userProperties = Object.fromEntries(cleanUserBody);
  if (Object.keys(userProperties).includes('department')) {
    const department = await req.server.prisma.hospitalDepartment.findFirst({
      where: {
        id: userProperties.department as string,
      },
      include: {
        hospital: true,
      },
    });
    if (!department) {
      return res.code(404).send({
        message: 'department_not_found',
      });
    }
    if (!department.hospital || !department.hospital_id) {
      return res.code(404).send({
        message: 'hospital_not_found',
      });
    }
    if (department.hospital.activated === false) {
      return res.code(422).send({
        message: 'hospital_deactivated',
      });
    }
  }
  if (userProperties.department) {
    userProperties.hospital_department_id = userProperties.department;
    delete userProperties.department;
  }
  const languages = await req.server.prisma.supportedLanguage.findMany({
    where: {
      id: {
        in: userProperties.spoken_languages as string[],
      },
    },
  });
  if (languages.length === 0) {
    return res.code(400).send({
      message: 'language_not_found',
    });
  }
  const modifiedUser = await req.server.prisma.user.update({
    where: {
      email: req.user.email,
    },
    data: userProperties,
    select: {
      id: true,
      email: true,
      first_name: true,
      last_name: true,
      job: true,
      user_name: true,
      spoken_languages: true,
      hospital_department: {
        select: {
          id: true,
          name: true,
          hospital: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });
  res.code(200).send({
    content: {
      id: modifiedUser.id,
      user_name: modifiedUser.user_name,
      first_name: modifiedUser.first_name,
      last_name: modifiedUser.last_name,
      email: modifiedUser.email,
      job: modifiedUser.job,
      department: {
        id: modifiedUser.hospital_department.id,
        name: modifiedUser.hospital_department.name,
      },
      hospital: {
        id: modifiedUser.hospital_department.hospital.id,
        name: modifiedUser.hospital_department.hospital.name,
      },
      spoken_languages: languages.map(l => l.id),
    },
  });
};
