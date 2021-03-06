const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const resolvers = require('./graphql/resolvers/index');
const typeDefs = require('./graphql/typeDefs.js')
const context = require('./graphql/context');
const { applyMiddleware } = require('graphql-middleware');

const server = new ApolloServer({
    typeDefs,
    resolvers
});



mongoose.connect('mongodb://localhost:27017/Cooper', {useNewUrlParser: true})
    .then(() => {
        console.log("MongoDB connected");
        return server.listen({port: 4000});
    })
    .then((res) => {
        console.log(`Server running at ${res.url}`);
    })
