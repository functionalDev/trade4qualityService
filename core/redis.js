import redis from 'redis';
import chalk from 'chalk';
const { promisify } = require('util');

import { REDIS_PORT, REDIS_HOST, REDIS_PASSWORD } from '../config';

export const client = redis.createClient(REDIS_PORT, REDIS_HOST);
REDIS_PASSWORD && client.auth(REDIS_PASSWORD);

const commands = [
  'get', 'set', 'lrange', 'lset', 'lindex', 'rpush', 'on', 'llen',
];

const promisifyCommands = (commands) => {
  return (
    commands.reduce((acc, command) => {
      acc[command] = promisify(client[command]).bind(client);
      return acc;
    }, {})
  );
};

export const asyncClient = Object.freeze(promisifyCommands(commands));
asyncClient.on('connect').then(() => console.log(chalk.hex('#009688')(' [*] Redis: Connection Succeeded.')));
asyncClient.on('error').then(err => console.error(err));
