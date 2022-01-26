// index.js
// This is the main entry point of our application
const express = require("express")
const process = require("process") // not required but recommended by Node Docs
const { ApolloServer, gql } = require("apollo-server-express") // ES6 object destructuring

const { notes: NOTES } = require("./demo-data")  // ES6 name while destructuring objects

// load environment variables from .env file into process.env
require('dotenv').config()

// get port from environment
const port = process.env.PORT || 4000

// define a schema, using GraphQl's Domain Specific Language(DSL) for schemas
const typeDefs = gql`
    type Note {
        id: ID!
        content: String!
        author: String!
    }
    type Query {
        hello: String!
        notes: [Note!]!
    }
`; // ES6 tagged template literal
// define resolver functions for fields defined in GraphQl schema
const resolvers = {
    Query: {
        hello: () => "Hello, GraphQL API!", // implicit return
        notes: () => NOTES
    }
}

const app = express() // initialize expresss

// setup Apollo's GraphQL server
const server = new ApolloServer({ typeDefs, resolvers }) // ES6 property shorthand

// use Apollo's middleware on express' http-server app to deploy GraphQL playground
server.applyMiddleware({ app, path: "/api"})

// equivalend of defining a route
app.get('/', (request, response) => response.send("Hello, JS Everywhere!!!"))

// run the app on port 4000
const log = `Listening  on port http://localhost:${port}
GraphQL Server running at http://localhost:${port}${server.graphqlPath}`
app.listen(port, () => console.log(log))