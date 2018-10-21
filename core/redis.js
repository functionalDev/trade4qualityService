import redis from 'redis';
import chalk from 'chalk';
const { promisify } = require('util');

import { REDIS_PORT, REDIS_HOST, REDIS_PASSWORD } from '../env';

export const client = redis.createClient(REDIS_PORT, REDIS_HOST);
client.auth(REDIS_PASSWORD);

export const asyncClient = Object.freeze(
  {
    get: promisify(client.get).bind(client),
    set: promisify(client.set).bind(client),
    on: promisify(client.on).bind(client),
  }
);

asyncClient.set('hellow', 'This is from redis!');
asyncClient.on('connect').then(() => console.log(chalk.hex('#009688')(' [*] Redis: Connection Succeeded.')));
asyncClient.on('error').then(err => console.error(err));
