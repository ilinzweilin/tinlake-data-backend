import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import typeDefs from './services/graphqlsettings/schema';
import resolvers  from './services/graphqlsettings/resolvers';
import fs from 'fs';
import https from 'https';
import http from 'http';
import config from './config';

console.log(config)
const configurations = {
  // Note: You may need sudo to run on port 443
  production: { ssl: true, port: 443 },
  development: { ssl: false, port: 4000 },
};

const { environment } = config;
const env_config = configurations[environment];

const apollo = new ApolloServer({ typeDefs, resolvers });

const app = express();
apollo.applyMiddleware({ app });

// Create the HTTPS or HTTP server, per configuration
let server;
if (env_config.ssl) {
  // Assumes certificates are in .ssl folder from package root. Make sure the files
  // are secured.
  server = https.createServer(
    {
      key: fs.readFileSync(`./ssl/${environment}/server.key`),
      cert: fs.readFileSync(`./ssl/${environment}/server.crt`),
    },
    app,
  );
} else {
  server = http.createServer(app);
}

// Add subscription support
apollo.installSubscriptionHandlers(server);

server.listen({ port: env_config.port }, () =>
  console.log(
    `🚀 Server ready at port :${env_config.port}${apollo.graphqlPath}`  
  ),
);
