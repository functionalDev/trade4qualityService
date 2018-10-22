import redis from 'redis';
import chalk from 'chalk';
const { promisify } = require('util');

import { REDIS_PORT, REDIS_HOST, REDIS_PASSWORD } from '../env';

export const client = redis.createClient(REDIS_PORT, REDIS_HOST);
client.auth(REDIS_PASSWORD);

const commands = [
  'get', 'set', 'lrange', 'lset', 'lindex', 'rpushx', 'on', 'llen',
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
// asyncClient.lset('user', 1, JSON.stringify({
//   username: 'Pauly',
// }));
// asyncClient.lset('user', 2, JSON.stringify({
//   username: 'Bartman',
// }));
asyncClient.on('connect').then(() => console.log(chalk.hex('#009688')(' [*] Redis: Connection Succeeded.')));
asyncClient.on('error').then(err => console.error(err));
