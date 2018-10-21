
import { external } from './external';
import { gql } from 'apollo-server-express';

// type Mutation {
//
// }

const basicSchema = gql`
type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }

  type Subscription {
    _: Boolean
  }
`;

export const schema = [
  basicSchema,
  external,
];
