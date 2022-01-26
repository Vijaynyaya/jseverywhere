const { gql } = require("apollo-server-express")

// define a schema, using GraphQl's Domain Specific Language(DSL) for schemas
const typeDefs = gql`
    scalar DateTime
    type Note {
        id: ID!
        content: String!
        author: String!
        createdAt: DateTime!
        updatedAt: DateTime!
    }
    type Query {
        notes: [Note!]!
        note(id: ID!): Note!
    }
    type Mutation {
        newNote(content: String!): Note!
        deleteNote(id: ID!): Boolean!
        updateNote(id: ID!, content: String!): Note!
    }
`; // ES6 tagged template literal

module.exports = typeDefs;