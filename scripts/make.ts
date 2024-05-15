import { select } from '@inquirer/prompts';
import chalk from 'chalk';
import { createUser } from './user';
import { createConversation } from './conversation';
import { createDevice } from './device';

const entities = [
  { name: 'User', value: 'user' },
  { name: 'Conversation', value: 'conversation' },
  { name: 'Device', value: 'device' },
  // { name: 'Hospital', value: 'hospital' },
  // { name: 'Department', value: 'department' },
  // { name: 'Device activation code', value: 'device_activation_code' },
  // { name: 'Conversation line', value: 'conversation_line' },
  // { name: 'Supported language', value: 'supported_language' },
];

const run = async () => {
  const type = await select({
    message: 'What would you like to make ?',
    choices: entities,
  });
  if (!type) {
    chalk.red.bold('Unknow error.');
    process.exit(1);
  }
  switch (type) {
    case 'user':
      createUser();
      break;
    case 'device':
      createDevice();
      break;
    case 'conversation':
      createConversation();
      break;
  }
};

run();
