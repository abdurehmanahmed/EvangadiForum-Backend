require("dotenv").config();
const express = require("express");
const cors = require('cors')

const app = express();
const port = 5000;

//  global middlewares that apply to all routes.
app.use(cors())
app.use(express.json()); // json middleware to extract json data

// const dbConnection = require("./db/dbConfig");
// const { users, questions, answers } = require("./Table/schema");


// const userRoutes = require("./routes/userRoute");
const questionRoutes = require("./routes/questionRoute");
const authMiddleware = require("./middleware/authMiddleware");


// user Route middleware
// app.use("/api/users", userRoutes);

// !Question route middleware
app.use("/api/questions", authMiddleware, questionRoutes);

// !Answer route middleware

// Start the server and create tables
async function start() {
  try {
    const result = await dbConnection.execute("select 'test' ");
    console.log("Database connection established");

    // Create tables
    await dbConnection.execute(users);
    await dbConnection.execute(questions);
    await dbConnection.execute(answers);

    await app.listen(port);
    console.log(`Listening on ${port}`);
  } catch (error) {
    console.log(error);
  }
}

// start server
start();