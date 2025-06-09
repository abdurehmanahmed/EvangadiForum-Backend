// db connection
const dbConnection = require("../Db/dbConfig");
const { StatusCodes } = require("http-status-codes");

// Create a question
async function createQuestion(req, res) {
  const { title, description,tag } = req.body;
  const userid = req.user.userid;

  // Validate required fields
  if (!title || !description) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Bad Request",
      message: "Please provide all required fields",
    });
  }

  try {
    // Insert new question into database
    await dbConnection.query(
      `
      INSERT INTO questions (userid, title, description, tag )
      VALUES (?, ?, ?, ?)
    `,
      [userid, title, description, tag]
    );

    // Return success message with 201 Created status
    return res.status(StatusCodes.CREATED).json({
      message: "Question created successfully",
    });
  } catch (error) {
    console.error(error.message);
    // Return 500 Internal Server Error for any unexpected errors
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
}

async function getSingleQuestion(req, res) {
  const { questionid } = req.params;

  try {
    const [question] = await dbConnection.query(
      `SELECT q.*, u.userid FROM questions q JOIN users u ON q.userid = u.userid WHERE q.questionid = ?`,
      [questionid]
    );

    if (question.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: `Question not found!! id: ${questionid} `,
      });
    }

    res.status(StatusCodes.OK).json({
      question: question[0]
    });
  } catch (error) {
    console.error("Error fetching question: ", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
}

const getAllQuestions = async (req, res) => {
  try {
    // The mysql2 package returns array with 2 elements from .query():
    const [questions] = await dbConnection.query(`
      SELECT 
        q.questionid ,
        q.title,
        q.description ,
        u.username,q.createdate 
      FROM questions q
      JOIN users u ON q.userid = u.userid

    `);

    if (questions.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: "Not Found",
        message: "No questions found.",
      });
    }

    res.status(StatusCodes.OK).json({ questions });
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",

      message: error.message || "An unexpected error occurred.",
    });
  }
};

module.exports = {
  getAllQuestions,
  getSingleQuestion,
  createQuestion,
};
