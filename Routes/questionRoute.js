const express = require("express");
const router = express.Router();

// Import question controller functions
const {
  createQuestion,
  getSingleQuestion,
  getAllQuestions,
} = require("../Controller/questionController");

router.post("/", createQuestion);
router.get("/", getAllQuestions);
router.get("/:questionid", getSingleQuestion);

module.exports = router;
