const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Query {
    hello: String
  }

  type Mutation {
    greet(name: String!): String
  }
`;

module.exports = typeDefs;
