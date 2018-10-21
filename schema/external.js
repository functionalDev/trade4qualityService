import { gql } from 'apollo-server-express';

// extend type Mutation {
//   createMessage(text: String!): Message!
//   deleteMessage(id: ID!): Boolean!
// }

export const external = gql`
  extend type Query {
    hello: String
    external: String
    user(id:ID!): User
    messages: [Message!]!
    message(id: ID!): Message!
  }

  type Message {
    id: ID!
    text: String!
    user: User!
  }

  type User {
    username: String!
    messages: [Message!]
  }
`;
