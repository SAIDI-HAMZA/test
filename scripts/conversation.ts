import { PrismaClient } from '@prisma/client';
import { IsEmail } from '../src/formats';
import { ManualInputType } from './types';

export const createConversation = async () => {
  const client = new PrismaClient();
  const _inputs: ManualInputType[] = [
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
};
