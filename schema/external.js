import { gql } from 'apollo-server-express';

export const external = gql`
  extend type Query {
    hello: String
    external: String
    user(id:ID!): User
    users: [User!]
    messages: [Message!]!
    message(id: ID!): Message!
  }
  extend type Mutation {
    createMessage(text: String!): Message!
  }
  extend type Subscription {
    messageAdded: Message
  }

  type Message {
    id: ID!
    text: String
    user: User!
  }

  type User {
    id: ID!
    username: String!
    messages: [Message!]
  }
`;
