require("dotenv").config(); // Loads environment variables from .env file
const express = require("express"); // Imports Express.js framework
const cors = require("cors"); // Imports CORS middleware for cross-origin requests

const app = express(); // Initializes Express application
const port = 2112; // Defines the port the server will listen on

// Global middlewares
// Enable CORS for all routes
app.use(cors());
// Parse JSON request bodies (crucial for req.body to not be undefined)
app.use(express.json()); // Corrected and ensured active

// DB connection and table schemas
const dbConnection = require("./Db/dbConfig"); // Imports database connection configuration
const { users, questions, answers } = require("./Table/Schema"); // Imports database schema definitions

// Routes
const userRoutes = require("./Routes/userRoute"); // Imports user-related routes
const questionRoutes = require("./Routes/questionRoute"); // Imports question-related routes
// Corrected casing for Middleware folder and authMiddleware file
const authMiddleware = require("./MiddleWare/authMiddleWare"); // Imports authentication middleware

// Correctly import the answer route file (fixed path from userRoute to answerRoute)
const answersRoute = require('./Routes/answerRoute'); 


// --- Route Middlewares ---
// User routes (no authentication needed for register/login, but check is protected)
app.use("/api/users", userRoutes);

// Question routes (protected by authMiddleware)
app.use("/api/questions", authMiddleware, questionRoutes);

// Answer routes (protected by authMiddleware - uncomment when ready to use)
app.use("/api/answers", authMiddleware, answersRoute); // Uncomment this line when you want to use answers routes


// Function to start the server and establish database connection
async function start() {
    try {
        // Test DB connection before starting the server
        await dbConnection.query("SELECT 'test'");
        console.log("Database connection established");

        // Execute schema queries to create tables if they don't exist
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