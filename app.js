require("dotenv").config(); // Loads environment variables from .env file
const express = require("express"); // Imports Express.js framework
const cors = require("cors"); // Imports CORS middleware for cross-origin requests

const app = express();
const PORT = 2112;

// Global middlewares
app.use(cors());
app.use(express.json());

// DB connection and table schemas
const dbConnection = require("./Db/dbConfig");
const { users, questions, answers } = require("./Table/schema");

// Routes
const userRoutes = require("./Routes/userRoute");
const questionRoutes = require("./Routes/questionRoute");
const answersRoute = require("./Routes/answerRoute");
const authMiddleware = require("./MiddleWare/authMiddleWare");

// Route middleware
app.use("/api/users", userRoutes);
app.use("/api/answer", authMiddleware, answersRoute);
app.use("/api/question", authMiddleware, questionRoutes);

// Function to start the server and establish database connection
async function start() {
  try {
    await dbConnection.query("SELECT 'test'"); // Test DB connection
    console.log("Database connection established");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    // Create tables if they don't exist
    await dbConnection.query(users);
    await dbConnection.query(questions);
    await dbConnection.query(answers);
  } catch (error) {
    // Log any errors that occur during server startup or DB connection
    console.error("Failed to start server:", error);
  }
}

// Call the start function to initiate the server
start();
