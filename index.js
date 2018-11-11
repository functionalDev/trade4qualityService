import cors from 'cors';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';

// import {
//   graphqlExpress,
//   graphiqlExpress,
// } from 'apollo-server-express';
// import { mergeSchemas } from 'graphql-tools';
import { PubSub } from 'apollo-server';

import session from 'express-session';
import connectRedis from 'connect-redis';
// import bodyParser from 'body-parser';
// import chalk from 'chalk';
// import { execute, subscribe } from 'graphql';

import { PORT, HOST, SECRET } from './config';
// import test from './config';
import { client, asyncClient } from './core/redis';
import { schemas } from './schema';
import { resolvers } from './resolvers';
import { models } from './models';

import { createServer } from 'http';
// import { SubscriptionServer } from 'subscriptions-transport-ws';
const pubsub = new PubSub();
const app = express();
app.use(cors());

app.use(session({
  store: new (connectRedis(session))({ client }),
  name: 'sid',
  resave: true,
  saveUninitialized: true,
  secret: SECRET,
}));

const server = new ApolloServer({
  typeDefs: schemas,
  resolvers,
  context: async ({ req, connection }) => {
    if (connection) {
      return {
        context: 'from context',
        models,
        pubsub,
        client: asyncClient,
        // loaders: {
        //   user: new DataLoader(keys =>
        //     loaders.user.batchUsers(keys, models),
        //   ),
        // },
      };
    }
    if (req) {
      // const me = await getMe(req);

      return {
        context: 'from context',
        models,
        pubsub,
        client: asyncClient,
        // me,
        secret: SECRET,
        // loaders: {
        //   user: new DataLoader(keys =>
        //     loaders.user.batchUsers(keys, models),
        //   ),
        // },
      };
    }
  },
});

server.applyMiddleware({ app, path: '/graphql' });

const httpServer = createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen({ port: PORT }, () => {
  console.log(`Apollo Server on http://${HOST}:${PORT}/graphql`);
});

// app.use('/graphql', bodyParser.json(), graphqlExpress({
//   schema,
// }));
//
// app.use('/graphiql', graphiqlExpress({
//   endpointURL: '/graphql',
//   subscriptionsEndpoint: `ws://${HOST}:${PORT}/subscriptions`,
// }));
//
// app.use(bodyParser.json());

// app.listen(PORT, HOST, () => {
//   console.log(chalk.hex('#009688')(' [*] App: Bootstrap Succeeded.'));
//   console.log(chalk.hex('#009688')(` [*] Host: http://${HOST}:${PORT}/graphql`));
// });
