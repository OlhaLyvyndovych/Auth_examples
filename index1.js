const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const resolvers = require('./graphql/resolvers/index');
const typeDefs = require('./graphql/typeDefs.js')
const context = require('./graphql/context');
const { applyMiddleware } = require('graphql-middleware');


const { shield, rule, and, inputRule, deny } = require("graphql-shield");

const schema = makeExecutableSchema({
    typeDefs,
    resolvers
});

const isAuthenticated = rule()(async (parent, args, ctx, info) => {
    return !!ctx.headers["user-id"];
  });

const permissions = shield({
    Query: {
      "*": deny,
      users: isAuthenticated,
      me: isAuthenticated,
    }
  });

  const schemaWithPermissions = applyMiddleware(schema, permissions);



const server = new ApolloServer({ schema: schemaWithPermissions })

mongoose.connect('mongodb://localhost:27017/Cooper', {useNewUrlParser: true})
    .then(() => {
        console.log("MongoDB connected");
        return server.listen({port: 4000});
    })
    .then((res) => {
        console.log(`Server running at ${res.url}`);
    })
