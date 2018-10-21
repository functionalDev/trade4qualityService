import cors from 'cors';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';

import session from 'express-session';
import connectRedis from 'connect-redis';
import bodyParser from 'body-parser';
import chalk from 'chalk';

import { PORT, HOST, SECRET } from './env';
import { client } from './core/redis';
import { schema as typeDefs } from './schema';
import { resolvers } from './resolvers';
import { models } from './models';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: {
    context: 'from context',
    models,
    client,
  },
});

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(session({
  store: new (connectRedis(session))({ client }),
  name: 'sid',
  resave: true,
  saveUninitialized: true,
  secret: SECRET,
}));

server.applyMiddleware({ app, path: '/graphql' });

app.listen(PORT, HOST, () => {
  console.log(chalk.hex('#009688')(' [*] App: Bootstrap Succeeded.'));
  console.log(chalk.hex('#009688')(` [*] Host: http://${HOST}:${PORT}/.`));
});
