const express = require("express");
const mongoose = require("mongoose");
const { ApolloServer, gql } = require("apollo-server-express");
const { users } = require("./users");
const graphQlSchema = require("./graphql/schema/index");
const graphQlResolvers = require("./graphql/resolver/index");

const typeDefs = gql`
  type User {
    id: Int
    name: String
    age: Int
    created_date: String
  }
  type Query {
    users: [User]
  }
  type Users {
    _id: ID!
    email: String!
    password: String
  }
  type AuthData {
    userId: ID!
    token: String!
    tokenExpiration: Int!
  }
  input UserInput {
    email: String!
    password: String!
  }
  type RootQuery {
    login(email: String!, password: String!): AuthData!
  }
  type RootMutation {
    createUser(userInput: UserInput): Users
  }
  schema {
    query: RootQuery
    mutation: RootMutation
  }
`;

const resolvers = {
  Query: {
    users: () => users
  },
  RootMutation: {
    createUser: () => users
  }
};

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-hsx7m.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    app.listen(8000);
  })
  .catch(err => {
    console.log(err);
  });

const server = new ApolloServer({ typeDefs, resolvers });

const app = express();
server.applyMiddleware({ app });

app.use(express.static("public"));

app.listen({ port: process.env.PORT || 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
