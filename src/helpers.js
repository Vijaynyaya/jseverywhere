const process = require("process")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const getUser = token => {
    if (token) {
        try {
            // extract user information
            return jwt.verify(token, process.env.JWT_SECRET)
        } catch (err) {
            throw new Error("Invalid Session")
        }
    }
}

module.exports = {
    getUser
}