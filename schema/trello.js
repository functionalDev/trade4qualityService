import { gql } from 'apollo-server-express';

export const trello = gql`
  extend type Query {
    currentAgenda: [TrelloCard]
    allIdeas: [TrelloCard]
  }
  extend type Mutation {
    addIdea(name: String!): TrelloCard
  }
  extend type Subscription {
    ideaAdded: TrelloCard
    agendaUpdated: [TrelloCard]
  }
  type TrelloCard {
    id: ID!
    name: String!
    desc: String
    due: String
    user: User!
    idLabels: [String]
    idList: String!
    pos: Int!
    url: String!
    members: String
    labels: String
  }
`;
