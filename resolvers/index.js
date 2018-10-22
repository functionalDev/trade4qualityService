// import { client } from '../core/redis';
const MESSAGE_ADDED = 'MESSAGE_ADDED';
const resolver = {
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
    users: (parent, args, { client }) => {
      return client.lrange(`user`, 0, 10).then(users => {
        return users
          .map((user) => JSON.parse(user))
          .map((user, index) => Object.assign({}, {id: index}, user));
      });
    },
    messages: (parent, args, { client }) => {
      return client.lrange(`messages`, 0, 999).then(messages => {
        return Object.values(messages)
          .map(message => JSON.parse(message));
      });
    },
    message: (parent, { id }, { models }) => {
      return models.messages[id];
    },
  },
  User: {
    messages: (user, args, { client }) => {
      return client.lrange(`messages`, 0, 999).then(messages => {
        console.log(messages);
        return Object.values(messages)
          .map(message => JSON.parse(message))
          .filter(message => message.userId === user.id);
      });
    },
  },

  Mutation: {
    createMessage: async (parent, { text }, { models, client, pubsub }) => {
      return client.llen(`messages`).then(id => {
        const userId = 1;
        const message = {
          id,
          text,
          userId,
        };
        client.rpushx(`messages`, JSON.stringify(message));
        console.log(message);
        pubsub.publish(MESSAGE_ADDED, { messageAdded: message });
        return message;
      });
    },
  },
  Subscription: {
    messageAdded: {
      subscribe: (parent, args, { client, pubsub }) => {
        return pubsub.asyncIterator([MESSAGE_ADDED]);
      },
    },
  },

  Message: {
    user: (message, args, { models }) => {
      return models.users[message.userId];
    },
  },
};

export const resolvers = [ resolver ];
