import path from 'path';
import { AutoloadPluginOptions } from '@fastify/autoload';

const config: AutoloadPluginOptions = {
  dir: path.join(process.cwd(), 'dist/src/plugins'),
  indexPattern: /.*plugin(\.ts|\.js)$/,
};

export { config as pluginsAutoload };
