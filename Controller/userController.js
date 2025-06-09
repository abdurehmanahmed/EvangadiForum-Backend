// Controller/userController.js

const dbConnection = require("../Db/dbConfig");

// Import necessary modules
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");

// --- Register Function ---
async function register(req, res) {
    const { username, email, password } = req.body;

    // 1. Input Validation
    if (!username || !email || !password) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ msg: "Please enter all required fields" });
    }

    try {
        // 2. Check if user already exists
        const [user] = await dbConnection.query(
            "SELECT username, userid FROM users WHERE email = ? OR username = ?",
            [email, username]
        );

        if (user.length > 0) {
            return res
                .status(StatusCodes.CONFLICT) // 409 Conflict indicates resource already exists
                .json({ msg: "User already exists with this email or username" });
        }

        // 3. Hash Password
        const salt = await bcrypt.genSalt(10); // Generate a salt for hashing
        const hashedPassword = await bcrypt.hash(password, salt); // Hash the password

        // 4. Save User to Database
        await dbConnection.query(
            "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
            [username, email, hashedPassword]
        );

        // 5. Success Response
        return res
            .status(StatusCodes.CREATED) // 201 Created indicates successful resource creation
            .json({ msg: "User registered successfully" });

    } catch (error) {
        // 6. Handle unexpected server errors
        console.error("Register error:", error.message);
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR) // 500 Internal Server Error
            .json({ msg: "Something went wrong during registration, please try again!" });
    }
}

// --- Login Function ---
async function login(req, res) {
    const { email, password } = req.body;

    // 1. Input Validation
    if (!email || !password) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ msg: "Please enter all required fields" });
    }

    try {
        // 2. Find user by email
        const [user] = await dbConnection.query(
            "SELECT username, userid, password FROM users WHERE email = ?",
            [email]
        );

        // 3. Check if user exists
        if (user.length === 0) {
            // Using a generic message for security, don't reveal if email or password is wrong
            return res
                .status(StatusCodes.UNAUTHORIZED) // 401 Unauthorized for authentication failure
                .json({ msg: "Invalid credentials" });
        }

        // 4. Compare provided password with hashed password from DB
        const isMatch = await bcrypt.compare(password, user[0].password);

        // 5. Check if passwords match
        if (!isMatch) {
            // Generic message for security
            return res
                .status(StatusCodes.UNAUTHORIZED) // 401 Unauthorized
                .json({ msg: "Invalid credentials" });
        }

        // 6. Generate JWT (JSON Web Token)
        const username = user[0].username;
        const userid = user[0].userid;
        const token = jwt.sign({ username, userid }, process.env.JWT_SECRET, { expiresIn: "1d" });

        // 7. Success Response with Token
        return res
            .status(StatusCodes.OK) // 200 OK
            .json({ msg: "User logged in successfully", username, token });

    } catch (error) {
        // 8. Handle unexpected server errors
        console.error("Login error:", error.message);
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR) // 500 Internal Server Error
            .json({ msg: "Something went wrong during login, please try again!" });
    }
}

// --- Check User Function ---
// This function runs AFTER authMiddleware has verified the JWT token.
// Its purpose is to confirm the user's authentication status and return basic info.
async function checkUser(req, res) {
    try {
        // authMiddleware should have populated req.user if the token is valid.
        // If req.user is not populated, it means authMiddleware failed or wasn't applied.
        if (!req.user || !req.user.userid || !req.user.username) {
            // This should ideally be caught by authMiddleware first, but acts as a safeguard.
            return res.status(StatusCodes.UNAUTHORIZED).json({ msg: "Authentication required or invalid token payload" });
        }

        // If we reach here, req.user contains the authenticated user's details from the token.
        return res.status(StatusCodes.OK).json({
            msg: "User authenticated",
            userid: req.user.userid,
            username: req.user.username
        });

    } catch (error) {
        // Catch any unexpected errors within this function (unlikely but good practice)
        console.error("Check user error:", error.message);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "An unexpected error occurred during user check." });
    }
}


// --- Export Functions ---
// Export all functions so they can be imported and used by other modules (like userRoute.js)
module.exports = {
    register,
    login,
    checkUser, // Ensure checkUser is correctly included here, and only once!
};