// import { client } from '../core/redis';

export const resolvers = {
  Query: {
    hello: (parent, args, { context }) => {
      return context;
    },
    external: (parent, args, { client }, info) => {
      return client.get('hellow').then((reply, err) => {
        return reply;
      });
    },
    user: (parent, { id }, { models }) => {
      return models.users[id];
    },
    messages: (parent, args, { models }) => {
      return Object.values(models.messages);
    },
    message: (parent, { id }, { models }) => {
      return models.messages[id];
    },
  },
  User: {
    messages: (user, args, { models }) => {
      return Object.values(models.messages).filter(
        message => message.userId === user.id,
      );
    },
  },

  Message: {
    user: (message, args, { models }) => {
      return models.users[message.userId];
    },
  },
};
