import { JwtHeader } from '@fastify/jwt';
import { Static, TSchema } from '@sinclair/typebox';
import { PrismaClient } from '@prisma/client';

declare module 'fastify' {
  interface FastifyInstance {
    env: {
      PORT: number;
      HOST: string;
    };
    prisma: PrismaClient;
  }
  interface FastifyTypeProvider {
    readonly input: unknown;
    readonly output: unknown;
  }
  interface FastifyTypeProviderDefault extends FastifyTypeProvider {
    output: this['input'] extends TSchema ? Static<this['input']> : never;
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    header: JwtHeader;
    payload: { iss: string; preferred_username: string };
    user: {
      email: string;
      first_name?: string;
      last_name?: string;
    };
  }
}

// https://stackoverflow.com/questions/73589103/how-to-extend-typescript-module-without-overriding-it
// make typescript understand it's a module
// if we don't do that, typescript will consider it as a global declaration and will not merge declarations
// if an export OR an import is added typescript will consider it as a module and then merge the declarations
// TODO: Remove when an import is added
export {};
