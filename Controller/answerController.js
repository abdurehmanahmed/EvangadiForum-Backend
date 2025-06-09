// Controller/answerController.js

const dbConnection = require("../Db/dbConfig"); // Corrected to use 'Db' for folder, and 'dbConfig'
const { StatusCodes } = require("http-status-codes"); // Import StatusCodes only once

async function getAnswersByQuestionId(req, res) {
    const { question_id } = req.params;

    if (!question_id || isNaN(question_id)) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            error: "Bad Request",
            message: "Invalid question ID.",
        });
    }

    try {
        const [answers] = await dbConnection.query( // Using dbConnection (consistent casing)
            `
            SELECT a.answer_id, a.answer AS content, u.username AS user_name, a.created_at
            FROM answers a
            JOIN users u ON a.user_id = u.userid
            WHERE a.question_id = ?
            ORDER BY a.created_at DESC
            `,
            [question_id]
        );

        if (answers.length === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({
                error: "Not Found",
                message: "No answers found for the requested question, or question does not exist."
            });
        }

        return res.status(StatusCodes.OK).json({ answers });

    } catch (error) {
        console.error("DB error (getAnswersByQuestionId):", error.message);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: "Internal Server Error",
            message: "An unexpected error occurred while fetching answers."
        });
    }
}

async function postAnswer(req, res) {
    // 1. get data from request body
    const { answer, questionid, userid } = req.body;

    // 2.input validation
    if (!answer || !questionid || !userid) {
        return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Please provide answer, question ID, and user ID!' });
    }

    try {
        // 3.database insertion
        // Corrected table name from 'answer' to 'answers' (plural, to match your schema)
        // Ensure column names in INSERT statement match your actual database schema (e.g., user_id, question_id)
        await dbConnection.query( // Using dbConnection (consistent casing)
            "INSERT INTO answers (user_id, question_id, answer) VALUES (?,?,?)",
            [userid, questionid, answer]
        );
        // 4. send success response
        return res.status(StatusCodes.CREATED).json({ msg: "Answer posted successfully!" });
    } catch (error) {
        // 5.handle errors
        console.error("Error posting answer:", error.message);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "An unexpected error occurred while posting the answer." });
    }
}

// Export all functions that this module provides
module.exports = {
    getAnswersByQuestionId,
    postAnswer,
};