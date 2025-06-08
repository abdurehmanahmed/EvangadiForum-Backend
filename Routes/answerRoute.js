//This file define the endpoint and link it to the controller function.
const express = require('express');
const router = express.Router()
const {postAnswer} = require ('../Controller/answerController');

//Define the post/api/answer endpoint

router.post('/',(req, res)=>{
    postAnswer(req,res);
})

module.exports = router