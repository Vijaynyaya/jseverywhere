// index.js
// This is the main entry point of our application
const express = require("express")
const app = express() // initialize expresss

// equivalend of defining a route
app.get('/', (request, response) => response.send("Hello, JS Everywhere!!!"))

// run the app on port 4000
app.listen(4000, () => console.log("Listening  on port 4000"))