const process = require("process")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { AuthenticationError, ForbiddenError } = require("apollo-server-express")
require("dotenv").config();

const gravatar = require("../util/gravatar"); // to generate a Gravatar image URL
const mongoose = require("mongoose");

// define resolver functions for mutations defined in GraphQl schema
module.exports = {
    signUp: async (parent, { username, email, password }, { models }) => {
        // normalize email address
        email = email.trim().toLowerCase();
        // hash the password
        const hashed = await bcrypt.hash(password, 10);
        // create gravatar url
        const avatar = gravatar(email);
        try {
            // create a user document in the database
            const user = await models.User.create({
                username,
                email,
                avatar,
                password: hashed
            })

            // create and return a json web token
            return jwt.sign({ id: user._id }, process.env.JWT_SECRET)

        } catch (err) {
            throw new Error("An error occured while creating account")
        }
    },
    signIn: async (parent, { username, email, password }, { models }) => {
        // normalize email address
        if (email) email = email.trim().toLowerCase();

        const user = await models.User.findOne({
            $or: [{ email }, { username }]
        });

        if (!user) throw new AuthenticationError("Error signing in");

        // match password
        const match = await bcrypt.compare(password, user.password);
        if (!match) throw new ForbiddenError("Invalid password")

        // create json web token
        return jwt.sign({ id: user._id }, process.env.JWT_SECRET)

    },
    newNote: async (parent, { content }, { models, user }) => {
        if (!user) throw new AuthenticationError("You must be signed in to create a new note.")
        
        return await models.Note.create({
            content,
            author: mongoose.Types.ObjectId(user.id)
        })
    },
    updateNote: async (parent, { id, content }, { models }) => {
        if (!user) throw new AuthenticationError("You must be signed in to update a note.")
        
        const note = await models.Note.findById(id);
        if (note && String(note.author) !== user.id) throw new ForbiddenError("You don't have permissions to update this note.")

        return await models.Note.findOneAndUpdate(
            {
                _id: id
            },
            {
                $set: {
                    content
                }
            },
            {
                new: true
            }
        );
    },
    deleteNote: async (parent, { id }, { models, user }) => {
        if (!user) throw new AuthenticationError("You must be signed in to delete a note.")

        const note = await models.Note.findById(id);
        if (note && String(note.author) !== user.id) throw new ForbiddenError("You don't have permissions to delete this note.")

        try {
            await note.remove();
            return true;
        } catch (err) {
            return false;
        }
    },
    toggleFavorite: async (parent, { id }, { models, user }) => {
        if (!user) throw new AuthenticationError();
        const note = await models.Note.findById(id);
        const hasUser = note.favoritedBy.indexOf(user.id)
        if (hasUser > -1) {
            return await models.Note.findByIdAndUpdate(
                id,
                {
                    $pull: {
                        favoritedBy: mongoose.Types.ObjectId(user.id)
                    },
                    $inc: {
                        favoriteCount: -1
                    }
                },
                {
                    new: true
                }
            )
        } else {
            return await models.Note.findByIdAndUpdate(
                id,
                {
                    $push: {
                        favoritedBy: mongoose.Types.ObjectId(user.id)
                    },
                    $inc: {
                        favoriteCount: 1
                    }
                },
                {
                    new: true
                }
            )
        }
    }
}