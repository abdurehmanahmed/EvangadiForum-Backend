// require("dotenv").config(); // Load environment variable
require("dotenv").config({ path: "../.env" });
const mysql2 = require("mysql2");

const dbConnection = mysql2.createPool({
  user: "evangadi-admin",
  password: "212121",
  host: "localhost",
  database: "evangadi-db",
  // || 10 - Fallback if the environment variable is: Missing/undefined/Empty string
  connectionLimit: 10,
});

// Converts the pool to use Promise-based queries instead of callbacks.

module.exports = dbConnection.promise();
