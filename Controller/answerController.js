const dbConnection = require("../Db/dbConfig");
const { StatusCodes } = require("http-status-codes");

async function getAnswersByQuestionId(req, res) {
  const { questionid } = req.params;

  if (!questionid || isNaN(questionid)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Invalid question ID",
      message: "Please provide a valid question ID",
    });
  }

  try {
    const [answers] = await dbConnection.query(
      `SELECT a.answerid, a.answer, u.username, a.createdate
       FROM answers a
       JOIN users u ON a.userid = u.userid
       WHERE a.questionid = ?
       ORDER BY a.createdate DESC`,
      [questionid]
    );

    // Format dates to ISO string before sending
    const formattedAnswers = answers.map((answer) => ({
      ...answer,
      createdate: new Date(answer.createdate).toISOString(),
    }));

    return res.status(StatusCodes.OK).json({
      answers: formattedAnswers,
      message: "Answers retrieved successfully",
    });
  } catch (error) {
    console.error("Database error:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Database error",
      message: "Failed to retrieve answers",
    });
  }
}

async function postAnswer(req, res) {
  const { answer, questionid } = req.body;
  const userid = req.user?.userid;

  if (!answer || !questionid || !userid) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Missing fields",
      message: "Please provide all required fields",
    });
  }

  try {
    const [result] = await dbConnection.query(
      `INSERT INTO answers (userid, questionid, answer) 
       VALUES (?, ?, ?)`,
      [userid, questionid, answer]
    );

    // Get the newly created answer with username
    const [newAnswer] = await dbConnection.query(
      `SELECT a.answerid, a.answer, u.username, a.createdate
       FROM answers a
       JOIN users u ON a.userid = u.userid
       WHERE a.answerid = ?`,
      [result.insertId]
    );

    return res.status(StatusCodes.CREATED).json({
      answer: {
        ...newAnswer[0],
        createdate: new Date(newAnswer[0].createdate).toISOString(),
      },
      message: "Answer posted successfully",
    });
  } catch (error) {
    console.error("Error posting answer:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Database error",
      message: "Failed to post answer",
    });
  }
}

module.exports = { getAnswersByQuestionId, postAnswer };