const process = require("process")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config();

const gravatar = require("../util/gravatar") // to generate a Gravatar image URL

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
    newNote: async (parent,{ content }, { models }) => await models.Note.create({
        content,
        author: "Omar Khayyam"
    }),
    updateNote: async (parent, { id, content }, { models }) => {
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
    deleteNote: async (parent, { id }, { models }) => {
        try {
            await models.Note.findOneAndRemove({ _id: id });
            return true;
        } catch (err) {
            return false;
        }
    }
}