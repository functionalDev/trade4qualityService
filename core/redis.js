import redis from 'redis';
import chalk from 'chalk';
const { promisify } = require('util');

import { REDIS_PORT, REDIS_HOST, REDIS_PASSWORD } from '../env';

const defaultClient = redis.createClient(REDIS_PORT, REDIS_HOST);
defaultClient.auth(REDIS_PASSWORD);

export const client = Object.freeze(
  {
    get: promisify(defaultClient.get).bind(defaultClient),
    set: promisify(defaultClient.set).bind(defaultClient),
    on: promisify(defaultClient.on).bind(defaultClient),
  }
);

client.set('hellow', 'This is from redis!');
client.on('connect').then(() => console.log(chalk.hex('#009688')(' [*] Redis: Connection Succeeded.')));
client.on('error').then(err => console.error(err));
