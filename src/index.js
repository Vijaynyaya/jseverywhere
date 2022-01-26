// index.js
// This is the main entry point of our application
const express = require("express")
const process = require("process")

// load environment variables from .env file into process.env
require('dotenv').config()

// get port from environment
const port = process.env.PORT || 4000

const app = express() // initialize expresss

// equivalend of defining a route
app.get('/', (request, response) => response.send("Hello, JS Everywhere!!!"))

// run the app on port 4000
app.listen(port, () => console.log(`Listening  on port ${port}`))