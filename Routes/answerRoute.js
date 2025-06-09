const express = require("express");
const router = express.Router();

// Import answer controller functions
const {
  getAnswersByQuestionId,
  postAnswer
} = require("../Controller/answerController");

// protected route to post an answer
router.post("/", postAnswer);

// protected route to get answer for a question
router.get("/:questionid", getAnswersByQuestionId);

module.exports = router;
