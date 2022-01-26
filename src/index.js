// index.js
// This is the main entry point of our application
const express = require("express")
const process = require("process") // not required but recommended by Node Docs
const { ApolloServer, gql } = require("apollo-server-express") // ES6 object destructuring
const db = require('./db')
const models = require("./models")

// load environment variables from .env file into process.env
require('dotenv').config()

// get environment variables
const port = process.env.PORT || 4000;
const DB_HOST = process.env.DB_HOST;

// connect to the database
db.connect(DB_HOST)

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
        note(id: ID!): Note!
    }
    type Mutation {
        newNote(content: String!): Note!
    }
`; // ES6 tagged template literal
// define resolver functions for fields defined in GraphQl schema
const resolvers = {
    Query: {
        hello: () => "Hello, GraphQL API!", // implicit return
        notes: async () => await models.Note.find(),
        note: async (parent, args) => await models.Note.findById(args.id)
    },
    Mutation: {
        newNote: async (parent, args) => await models.Note.create({
            content: args.content,
            author: "Omar Khayyam"
        })
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