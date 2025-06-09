const express = require("express");
const router = express.Router();

// Import question controller functions

const { getSingleQuestion } = require("../Controller/questionController");
const { getAllQuestions } = require("../Controller/questionController");
const { createQuestion } = require("../Controller/questionController");

router.get("/", getAllQuestions);
router.get("/:question_id", getSingleQuestion);
router.post("/", createQuestion);

module.exports = router;
