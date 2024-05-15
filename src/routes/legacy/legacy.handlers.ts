import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { RouteHandler } from '../../types/route';
import { addDays } from '../../../src/utils/date';
import * as Schemas from './legacy.schemas';

export const createConversation: RouteHandler<
  typeof Schemas.createConversation
> = async (req, res) => {
  const mostUsedLocales = req.body.conversations.reduce(
    (acc: { [index: string]: number }, curr) => {
      if (acc[curr.language]) {
        acc[curr.language] += 1;
      } else {
        acc[curr.language] = 1;
      }
      return acc;
    },
    {}
  );
  const locales = await req.server.prisma.supportedLanguage.findMany({
    where: {
      locale_short: {
        in: Object.entries(mostUsedLocales).map(item => item[0]),
      },
    },
    select: {
      id: true,
      locale_short: true,
    },
  });
  try {
    await req.server.prisma.conversation.create({
      data: {
        device: {
          connect: {
            unique_id: req.body.tabletUniqueKey,
          },
        },
        review_due_date: addDays(3),
        accurate: req.body.conversations[0].audioFile === null,
        // add these fields on the app.
        ended_at: new Date(),
        started_at: new Date(),
        updated_at: new Date(),
        lines: {
          create: req.body.conversations.map(item => ({
            locale: {
              connect: {
                id: locales.filter(l => l.locale_short === item.language)[0].id,
              },
            },
            original_text: item.original,
            speaker: item.professional ? 'MEDICAL_TEAM' : 'PATIENT',
            translated_text: item.traduction,
            audio: item.audioFile
              ? {
                  create: {
                    audio_path: item.audioFile,
                  },
                }
              : undefined,
            added_at: new Date(item.timestamp),
          })),
        },
      },
    });
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError && e.code === 'P2025') {
      return res.code(404).send({
        message: 'device_not_found',
      });
    }
    console.log(e);
    req.server.log.error(
      'Failed to create a conversation on legacy route: ',
      e
    );
    return res.code(500).send({
      message: 'unhandled_error',
    });
  }
  res.code(200).send();
};

export const pairDevice: RouteHandler<typeof Schemas.pairDevice> = async (
  req,
  res
) => {
  const code = await req.server.prisma.deviceActivationCodes.findFirst({
    where: {
      code: req.body.associationCode,
    },
  });
  console.log(req.body.associationCode);
  console.log(req.body.tabletUniqueKey);
  console.log(req.body.name);
  if (!code) {
    return res.code(404).send({
      message: 'activation_code_not_found',
    });
  }
  const existingDevice = await req.server.prisma.device.findFirst({
    where: {
      unique_id: req.body.tabletUniqueKey,
    },
  });
  if (existingDevice) {
    return res.code(422).send({
      message:
        existingDevice.verified === false
          ? 'device_not_verified'
          : 'device_already_paired',
    });
  }
  const device = await req.server.prisma.device.update({
    where: {
      id: code.device_id,
    },
    data: {
      name: req.body.name,
      unique_id: req.body.tabletUniqueKey,
      verified: true,
    },
    select: {
      department: {
        select: {
          name: true,
          hospital: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });
  await req.server.prisma.deviceActivationCodes.delete({
    where: {
      id: code.id,
    },
  });
  res.code(200).send({
    hospitalName: device.department.hospital.name,
    serviceName: device.department.name,
  });
};
