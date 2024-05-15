/* eslint-disable @typescript-eslint/ban-ts-comment */
import { input, select } from '@inquirer/prompts';
import { PrismaClient } from '@prisma/client';
import { ManualInputType } from './types';

export const createDevice = async () => {
  const client = new PrismaClient();
  const activation_code = Math.floor(
    100000 + Math.random() * 999999
  ).toString();
  const inputs: ManualInputType[] = [
    {
      key: 'name',
      name: 'Name',
    },
    {
      key: 'unique_id',
      name: 'Unique ID',
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
  const chosenDepartment = await select({
    choices: departments.map(item => ({
      name: item.name,
      value: item.id,
    })),
    message: 'Hospital department',
  });

  console.log({
    ...inputs.reduce((acc, curr) => {
      // @ts-ignore
      acc[curr.key] = curr.value || null;
      return acc;
    }, {}),
    department_id: chosenDepartment,
    device_activation_codes: {
      create: {
        code: activation_code,
      },
    },
  });
  await client.device.create({
    // @ts-ignore
    data: {
      ...inputs.reduce((acc, curr) => {
        // @ts-ignore
        acc[curr.key] = curr.value || null;
        return acc;
      }, {}),
      department: {
        connect: {
          id: chosenDepartment,
        },
      },
      device_activation_codes: {
        create: {
          code: activation_code,
        },
      },
    },
  });
};
