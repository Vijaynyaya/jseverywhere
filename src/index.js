// index.js
// This is the main entry point of our application
const express = require("express")
const process = require("process") // not required but recommended by Node Docs
const { ApolloServer } = require("apollo-server-express") // ES6 object destructuring
const depthLimit = require("graphql-depth-limit");
const { createComplexityLimitRule } = require("graphql-validation-complexity")
const helmet = require("helmet")
const cors = require("cors")
const db = require('./db')
const models = require("./models")
const typeDefs = require("./schema")
const resolvers = require("./resolvers")
const { getUser } = require("./helpers")

// load environment variables from .env file into process.env
require('dotenv').config()

// get environment variables
const port = process.env.PORT || 4000;
const DB_HOST = process.env.DB_HOST;

// connect to the database
db.connect(DB_HOST)

const app = express() // initialize expresss
app.use(helmet()) // secure HTTP headers
app.use(cors()) // allow CORS

// setup Apollo's GraphQL server
const server = new ApolloServer({ 
    typeDefs, 
    resolvers,
    validationRules: [depthLimit(5), createComplexityLimitRule(1000)],
    context: ({ req }) => {
        // get jwt from request headers
        const token = req.headers.authorization;
        // try retrieving the user information
        const user = getUser(token);
        // add models to context which is available to resolvers as the third argument
        return { models, user }
    }
})

// use Apollo's middleware on express' http-server app to deploy GraphQL playground
server.applyMiddleware({ app, path: "/api"})

// equivalend of defining a route
app.get('/', (request, response) => response.send("Hello, JS Everywhere!!!"))

// run the app on port 4000
const log = `Listening on port http://localhost:${port}
GraphQL Server running at http://localhost:${port}${server.graphqlPath}`
app.listen(port, () => console.log(log))