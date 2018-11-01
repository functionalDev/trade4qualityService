import fetch from 'node-fetch';
// import { client } from '../core/redis';
const IDEA_ADDED = 'IDEA_ADDED';
export const trello = {
  Query: {
    currentAgenda: (parent, args, { context }) => {
      return fetch('https://api.trello.com/1/lists/5bcdc25eca0a1802b6c44e57/cards')
        .then(res => res.text())
        .then(body => JSON.parse(body));
    },
    allIdeas: (parent, args, { context }) => {
      return context;
    },
  },
  TrelloCard: {
    members: (card, args, { models }) => {
      return card.idMembers
        .map(id => models.members[id])
        .map(member => member && member.username || '')
        .join(' ');
    },
    labels: (card, args, { models }) => {
      return card.idLabels
        .map(id => models.labels[id])
        .map(label => label && label.name || '')
        .join(' ');
    },
  },

  Mutation: {
    addIdea: async (parent, { text }, { pubsub }) => {
      const userId = 1;
      const idea = {
        text,
        userId,
      };
        // client.rpushx(`messages`, JSON.stringify(idea));
      console.log(idea);
      pubsub.publish(IDEA_ADDED, { idea });
      return idea;
    },
  },
  Subscription: {
    ideaAdded: {
      subscribe: (parent, args, { pubsub }) => {
        return pubsub.asyncIterator([IDEA_ADDED]);
      },
    },
  },
};
