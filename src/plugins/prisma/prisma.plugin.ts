import fp from 'fastify-plugin';
import { PrismaClient } from '@prisma/client';
import { ServerInstance } from '../../..';

export default fp(
  async function (server: ServerInstance) {
    const prisma = new PrismaClient();

    await prisma.$connect();

    // Make Prisma Client available through the fastify server instance: server.prisma
    server.decorate('prisma', prisma);

    server.addHook('onClose', async instance => {
      await instance.prisma.$disconnect();
    });
  },
  {
    name: 'prisma-plugin',
  }
);

export const autoConfig = {
  name: 'prisma-plugin',
};
