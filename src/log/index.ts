import { Chalk as ChalkInstance } from 'chalk';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const chalk = require('chalk') as ChalkInstance;
import pino from 'pino';
import pinoPretty from 'pino-pretty';

const LEVEL_MAPPING: Record<number, string> = {
  10: ' TRACE ',
  20: ' DEBUG ',
  30: 'info',
  40: 'warn',
  50: 'error',
  60: 'fatal',
};

const LEVEL_COLORS: Record<number, ChalkInstance> = {
  10: chalk.bgRed.white.bold,
  20: chalk.bgYellow.white.bold,
  30: chalk.blue.bold,
  40: chalk.yellow.bold,
  50: chalk.red.bold,
  60: chalk.bgBlack.white.bold.underline,
};

const logger = pino(
  { level: 'trace' },
  pinoPretty({
    customPrettifiers: {
      level: logLevel =>
        LEVEL_COLORS[logLevel as unknown as number](
          LEVEL_MAPPING[logLevel as unknown as number]
        ),
    },
  })
);

export default logger;
