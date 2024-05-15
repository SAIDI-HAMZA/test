import path from 'path';
import { AutoloadPluginOptions } from '@fastify/autoload';

const config: AutoloadPluginOptions = {
  dir: path.join(process.cwd(), 'dist/src/routes'),
  indexPattern: /.*route(\.ts|\.js)$/,
  ignoreFilter: filterPath =>
    filterPath.includes('supported_languages') ||
    filterPath.includes('hospitals'),
};

export { config as routesAutoload };
