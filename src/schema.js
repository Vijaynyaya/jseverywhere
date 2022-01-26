const { gql } = require("apollo-server-express")

// define a schema, using GraphQl's Domain Specific Language(DSL) for schemas
const typeDefs = gql`
    scalar DateTime
    type User {
        id: ID!
        username: String!
        email: String!
        avatar: String
        notes: [Note!]!
        favorites: [Note!]!
    }
    type Note {
        id: ID!
        content: String!
        author: User!
        createdAt: DateTime!
        updatedAt: DateTime!
        favoriteCount: Int!
        favoritedBy: [User]!
    }
    type Query {
        notes: [Note!]!
        note(id: ID!): Note!
        user(username: String!): User
        users: [User!]!
        me: User!
    }
    type Mutation {
        newNote(content: String!): Note!
        deleteNote(id: ID!): Boolean!
        updateNote(id: ID!, content: String!): Note!
        toggleFavorite(id: ID!): Note!
        signUp(username: String!, email: String!, password: String!): String!
        signIn(username: String, email: String, password: String!): String!
    }
`; // ES6 tagged template literal

module.exports = typeDefs;