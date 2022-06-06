const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    context: ({ req }) => {
        // Get the user token from the headers.
        const token = req.headers.authorization || '';

        // Try to retrieve a user with the token
        const user = getUser(token);

        // we could also check user roles/permissions here
        if (!user) throw new AuthenticationError('you must be logged in');

        // Add the user to the context
        return { user };
    }
});