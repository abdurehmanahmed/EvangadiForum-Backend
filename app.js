require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const port = 2112;

// Global middlewares
app.use(cors());
app.use(express.json());


// DB connection and table schemas

const dbconnection = require ('./Db/dbConfig')
const { users, questions, answers } = require("./Table/Schema");

// Routes
const userRoutes = require("./Routes/userRoute");
const questionRoutes = require("./Routes/questionRoute");
// const authMiddleware = require("./MiddleWare/authMiddleware");

// Apply routes
app.use("/api/users", userRoutes);
// app.use("/api/questions", authMiddleware, questionRoutes);

// Start server and create tables
async function start() {
  try {
     await dbConnection.query("SELECT 'test'"); // Test DB connection
    console.log("Database connection established");

    // Create tables
    await dbConnection.execute(users);
    await dbConnection.execute(questions);
    await dbConnection.execute(answers);

    await app.listen(port);

}

// start server

start();

