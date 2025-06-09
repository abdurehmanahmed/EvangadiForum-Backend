require("dotenv").config(); // Loads environment variables from .env file
const express = require("express"); // Imports Express.js framework
const cors = require("cors"); // Imports CORS middleware for cross-origin requests

const app = express(); // Initializes Express application
const port = 2112; // Defines the port the server will listen on

// Global middlewares
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies

// DB connection and table schemas
const dbConnection = require("./Db/dbConfig");
const { users, questions, answers } = require("./Table/Schema");

// Routes
const userRoutes = require("./Routes/userRoute"); // Imports user-related routes
const questionRoutes = require("./Routes/questionRoute"); // Imports question-related routes
const authMiddleware = require("./MiddleWare/authMiddleWare"); // Imports authentication middleware
const answersRoute = require("./Routes/answerRoute"); // Imports answer-related routes

// Apply routes
app.use("/api/users", userRoutes); // User routes (no authentication needed for register/login)
app.use("/api/questions", authMiddleware, questionRoutes); // Question routes (protected by authMiddleware)
app.use("/api/answers", authMiddleware, answersRoute); // Answer routes (protected by authMiddleware)

// Function to start the server and establish database connection
async function start() {
try {
    // Test DB connection before starting the server
    await dbConnection.query("SELECT 'test'");
    console.log("Database connection established");

    // Create tables if they don't exist
    await dbConnection.query(users);
    await dbConnection.query(questions);
    await dbConnection.query(answers);

    // Start the Express server
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (error) {
    // Log any errors that occur during server startup or DB connection
    console.error("Failed to start server:", error);
  }
}

// Call the start function to initiate the server
start();