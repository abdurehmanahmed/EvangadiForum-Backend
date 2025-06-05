require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const port = 2112;

//  global middlewares that apply to all routes.
app.use(cors());
app.use(express.json()); // json middleware to extract json data

const dbConnection = require("./db/dbConfig");

const userRoutes = require("./routes/userRoute");
const questionRoutes = require("./routes/questionRoute");
const authMiddleware = require("./middleware/authMiddleware");

// user Route middleware
app.use("/api/users", userRoutes);

// !Question route middleware
app.use("/api/questions", authMiddleware, questionRoutes);

// !Answer route middleware

async function start() {
  try {
    const result = await dbConnection.execute("select 'test' ");
    await app.listen(port);
    console.log("Database connection established");
    console.log(`Listening on ${port}`);
  } catch (error) {
    console.log(error);
  }
}

// start server
start();
