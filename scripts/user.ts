/* eslint-disable @typescript-eslint/ban-ts-comment */
import { input, select, checkbox } from '@inquirer/prompts';
import { PrismaClient } from '@prisma/client';
import { IsEmail } from '../src/formats';
import { ManualInputType } from './types';

export const createUser = async () => {
  const client = new PrismaClient();
  const inputs: ManualInputType[] = [
    {
      name: 'Email',
      key: 'email',
      value: '',
      validate: async str => {
        if (IsEmail(str)) {
          const count = await client.user.count({
            where: {
              email: str,
            },
          });
          if (count > 0) {
            return 'Email already taken';
          }
          return true;
        }
        return 'Please provide a valid email';
      },
    },
    {
      name: 'First name',
      key: 'first_name',
      value: '',
      validate: val => val !== '',
    },
    {
      name: 'Last name',
      key: 'last_name',
      value: '',
      validate: val => val !== '',
    },
    {
      name: 'User name',
      key: 'user_name',
      value: '',
      validate: async str => {
        if (str !== '') {
          const count = await client.user.count({
            where: {
              user_name: str,
            },
          });
          if (count > 0) {
            return 'User name already taken';
          }
          return true;
        }
        return 'Please provide a valid email';
      },
    },
    {
      name: 'Job',
      key: 'job',
      value: '',
      validate: val => val !== '',
    },
  ];
  for (const inp of inputs) {
    inp['value'] = await input({
      message: inp.name,
      validate: inp.validate,
    });
  }
  const hospitals = await client.hospital.findMany();
  const chosenHospital = await select({
    choices: hospitals.map(item => ({
      name: item.name,
      value: item.id,
    })),
    message: 'Hospital',
  });
  const departments = await client.hospitalDepartment.findMany({
    where: {
      hospital_id: chosenHospital,
    },
  });
  const supported_languages = await client.supportedLanguage.findMany();
  const chosenDepartment = await select({
    choices: departments.map(item => ({
      name: item.name,
      value: item.id,
    })),
    message: 'Hospital department',
  });
  const chosenSpokenLanguages = await checkbox({
    choices: supported_languages.map(item => ({
      name: item.locale_long,
      value: item.id,
    })),
    message: 'Supported languages',
  });

  await client.user.create({
    // @ts-ignore
    data: {
      ...inputs.reduce((acc, curr) => {
        // @ts-ignore
        acc[curr.key] = curr.value;
        return acc;
      }, {}),
      access_roles: ['ADMIN'],
      hospital_department_id: chosenDepartment,
      spoken_languages: chosenSpokenLanguages,
    },
  });
};
