import {
  Device,
  Hospital,
  HospitalDepartment,
  PrismaClient,
  SupportedLanguage,
  User,
} from '@prisma/client';
import logger from '../src/log';
import {
  audios,
  conversationLines,
  conversations,
  hospitalDepartments,
  hospitals,
  supportedLanguages,
} from './constants';

const run = async () => {
  if (process.env.NODE_ENV !== 'development') {
    logger.error('Fixtures are disabled in production.');
    return;
  }
  const client = new PrismaClient();
  await client.$connect();
  const hospitalDepartment = await runHospitalsFixtures(client);
  if (!hospitalDepartment) {
    logger.error('Skipping other fixtures.');
    return;
  }
  const locales = await runLanguagesFixtures(client);
  const user = await runUserFixtures(client, hospitalDepartment);
  const device = await runDeviceFixtures(client, user, hospitalDepartment);
  const locale_fr = await client.supportedLanguage.findFirst({
    where: {
      locale_short: 'fr',
    },
  });
  await runConversationsFixtures(
    client,
    user,
    device,
    locales,
    locale_fr?.id || null
  );
};

const runUserFixtures = async (
  client: PrismaClient,
  hospitalDepartment: HospitalDepartment | null
): Promise<User | null> => {
  try {
    if (!hospitalDepartment) {
      logger.error('Skipping user fixtures');
      return Promise.resolve(null);
    }
    logger.info('Checking users in database...');
    const uc = await client.user.count();
    if (uc === 0) {
      logger.info('Running fixtures for users');
      await client.user.create({
        data: {
          email: 'e.freisa@groupeonepoint.com',
          first_name: 'Eric',
          last_name: 'Freisa',
          user_name: 'EricFreisa',
          job: 'Docteur',
          access_roles: ['ADMIN'],
          hospital_department_id: hospitalDepartment.id,
        },
      });
      return Promise.resolve(
        await client.user.findFirst({
          where: {
            email: 'e.freisa@groupeonepoint.com',
          },
        })
      );
    }
    return Promise.resolve(null);
  } catch (err) {
    return Promise.resolve(null);
  }
};

const runDeviceFixtures = async (
  client: PrismaClient,
  user: User | null,
  hospitalDepartment: HospitalDepartment | null
): Promise<Device | null> => {
  try {
    if (user === null || hospitalDepartment === null) {
      logger.error('Skipping device fixtures');
      return Promise.resolve(null);
    }
    logger.info('Checking device fixtures');
    const dc = await client.device.count();
    if (dc === 0) {
      logger.info('Running fixtures for device...');
      await client.device.create({
        data: {
          name: 'Android Tablet 1',
          unique_id: '0123456789012345',
          verified: true,
          department: {
            connect: hospitalDepartment,
          },
          device_assignment: {
            create: {
              full_name: 'EricFreisa',
            },
          },
        },
      });
    } else {
      logger.error('Skipping device fixtures');
      return Promise.resolve(null);
    }
    return Promise.resolve(await client.device.findFirst());
  } catch (err) {
    console.log(err);
    return Promise.resolve(null);
  }
};

const runHospitalsFixtures = async (
  client: PrismaClient
): Promise<HospitalDepartment | null> => {
  try {
    logger.info('Checking hospitals in database...');
    const hc = await client.hospital.count();
    let hs: Hospital[] = [];
    if (hc === 0) {
      logger.info('Running fixtures for hospitals');
      await client.hospital.createMany({
        skipDuplicates: true,
        data: hospitals,
      });
    }
    if (hc >= 1) {
      logger.error('Skipping hospitals fixtures');
      return Promise.resolve(null);
    }
    hs = await client.hospital.findMany();

    logger.info('Checking hospitals departments in database...');
    const hdc = await client.hospitalDepartment.count();
    if (hdc === 0) {
      logger.info('Running fixtures for hospitals departments');
      const hd: Omit<HospitalDepartment, 'id'>[] = [];
      hs.forEach(h => {
        hospitalDepartments.forEach(d => {
          hd.push({
            hospital_id: h.id,
            name: d,
          });
        });
      });
      await client.hospitalDepartment.createMany({
        skipDuplicates: true,
        data: hd,
      });
    } else {
      return Promise.resolve(null);
    }
    return Promise.resolve(await client.hospitalDepartment.findFirst());
  } catch (err) {
    return Promise.resolve(null);
  }
};

const runLanguagesFixtures = async (
  client: PrismaClient
): Promise<SupportedLanguage[] | null> => {
  try {
    logger.info('Checking supported languages in database...');
    const slCount = await client.supportedLanguage.count();
    if (slCount === 0) {
      logger.info('Running fixtures for supported languages');
      await client.supportedLanguage.createMany({
        skipDuplicates: true,
        data: supportedLanguages.map(({ locale_long, locale_short }) => ({
          locale_long,
          locale_short,
        })),
      });
    } else {
      logger.info('Skipping supported languages fixtures.');
      return Promise.reject();
    }
    return Promise.resolve(
      await client.supportedLanguage.findMany({
        take: 3,
      })
    );
  } catch (err) {
    return Promise.reject();
  }
};

const runConversationsFixtures = async (
  client: PrismaClient,
  user: User | null,
  device: Device | null,
  locales: SupportedLanguage[] | null,
  locale_fr_id: string | null
) => {
  try {
    if (!user || !device || !locales || !locale_fr_id) {
      logger.error('Skipping conversation fixtures');
      return Promise.resolve(null);
    }
    logger.info('Checking conversations fixtures in the database...');
    const conversationsCount = await client.conversation.count();
    const conversationsLinesCount = await client.conversationLine.count();
    if (conversationsCount >= 1 || conversationsLinesCount) {
      logger.info('Skipping conversation fixtures');
    } else {
      logger.info('Running fixtures for conversations');
      await client.conversation.createMany({
        data: conversations.map(c => ({
          ...c,
          device_id: device.id,
        })),
      });
      await client.conversationAudio.createMany({
        data: audios,
      });
      const createdAudios = await client.conversationAudio.findMany({
        take: 9,
      });
      const createdConversations = await client.conversation.findMany({
        take: conversations.length,
      });
      let count = 0;
      const promises = createdConversations.map((c, index) => {
        const lines = conversationLines.splice(0, 3);
        return client.conversationLine.createMany({
          data: lines.map((l, linesIndex) => {
            const data = {
              ...l,
              locale_id:
                linesIndex % 2 !== 0 ? locale_fr_id : locales[index].id,
              conversation_id: c.id,
              conversation_audio_id: createdAudios[count]
                ? createdAudios[count].id
                : null,
            };
            count += 1;
            return data;
          }),
        });
      });
      await Promise.all(promises);
    }
    return Promise.resolve();
  } catch (err) {
    return Promise.resolve(null);
  }
};

run();
