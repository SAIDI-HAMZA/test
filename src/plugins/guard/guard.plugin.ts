import fp from 'fastify-plugin';
import { ServerInstance } from '../../..';
import { guardConfig } from '../../config';

export default fp(
  async function (server: ServerInstance) {
    server.addHook('preParsing', async (request, response) => {
      // Let the not found handler handle it
      if (request.routerPath === undefined) {
        return;
      }
      if (request.method === 'OPTIONS') {
        return;
      }
      try {
        if (
          request.url.startsWith('/docs') ||
          request.url.startsWith('/misc/data-lists') ||
          request.url.startsWith('/health') ||
          request.url.startsWith('/legacy') ||
          request.url.startsWith('/translations')
        ) {
          return;
        }
        if (request.url.startsWith('/conversations/audio/')) {
          const token = (request.query as { token: string }).token;
          request.headers.authorization = `Bearer ${token}`;
        }
        const result = await request.jwtVerify({
          algorithms: ['RS256'],
        });
        if (!result) {
          server.log.error('Failed to verify token: ', result);
          return response.code(401).send({
            message: 'unauthorized',
          });
        }
        if (
          request.routerPath === '/users/profile' &&
          (request.method === 'POST' || request.method === 'GET')
        ) {
          return;
        }
        if (request.routerPath === '/hospitals/departments') {
          return;
        }
        const user = await server.prisma.user.findFirst({
          where: {
            email: request.user.email,
          },
        });
        if (!user) {
          server.log.error(
            `Tried to access resource ${request.routerPath} while user doesn't exists.`
          );
          return response.code(401).send({
            message: 'unauthorized',
          });
        }
        if (!user.access_roles || user.access_roles.length < 1) {
          server.log.error(
            `Tried to access resource ${request.routerPath} while user doesn't have roles.`
          );
          return response.code(401).send({
            message: 'unauthorized',
          });
        }
        const url = request.routerPath
          .substring(1, request.routerPath.length)
          .split('/');
        url.shift();
        if (!Object.keys(guardConfig).includes(url[0])) {
          if (!user.access_roles.includes('ADMIN')) {
            server.log.error(
              `Tried to access resource ${request.routerPath} while user is not ADMIN and route isn't explicitly guarded.`
            );
            return response.code(401).send({
              message: 'unauthorized',
            });
          } else {
            return;
          }
        }
        if (
          guardConfig[url[0]] &&
          guardConfig[url[0]][url[1]] &&
          !guardConfig[url[0]][url[1]].some(
            entry => user.access_roles.indexOf(entry) >= 0
          )
        ) {
          server.log.error(
            `Tried to access resource ${request.routerPath} while user doesn't have the correct roles.`
          );
          return response.code(401).send({
            message: 'unauthorized',
          });
        }
      } catch (err) {
        server.log.info(`Error in guard plugin: ${err}`);
        response.code(401).send({
          message: 'unauthorized',
        });
      }
    });
  },
  {
    name: 'guard-plugin',
    dependencies: ['prisma-plugin'],
  }
);

export const autoConfig = {
  name: 'guard-plugin',
};

// maybe do it with fastify-guard
