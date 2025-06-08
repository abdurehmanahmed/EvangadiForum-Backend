require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const port = 2112;

// Global middlewares
app.use(cors());
app.use(express.json());

// DB connection and table schemas
const dbConnection = require("./Db/dbConfig");
const { users, questions, answers } = require("./Table/Schema");



// const userRoutes = require("./Routes/userRoute");
// // const questionRoutes = require("./Routes/questionRoute");
// const authMiddleware = require("./MiddleWare/authMiddleWare")

// Routes
const userRoutes = require("./Routes/userRoute");
const questionRoutes = require("./Routes/questionRoute");
// const authMiddleware = require("./middleware/authMiddleware");


// user Route middleware
app.use("/api/users", userRoutes);

// !Question route middleware
// app.use(express.json())  // Middleware to parse JSON
app.use("/api/questions", questionRoutes); //
// const PORT = process.env.PORT || 2112;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
// Apply routes
app.use("/api/users", userRoutes);
// app.use("/api/questions", authMiddleware, questionRoutes);

// Start server and create tables


async function start() {
  try {
    await dbConnection.query("SELECT 'test'"); // Test DB connection
    console.log("Database connection established");

      
    // start server
    await dbConnection.query(users);
    await dbConnection.query(questions);
    await dbConnection.query(answers);

    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
}

start();

