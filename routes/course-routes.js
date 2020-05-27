'use strict';

const db = require('../db.js');
const express = require("express")
const asyncHandler = require("./asyncHandler.js")
const authenticateUser = require("./authenticateUser.js")

const {Course} = db.models;
const router = express.Router();

router.get('/courses', async (req, res) => {
    const courses = await Course.findAll({order: [ ['title', 'ASC'] ]});
    res.json(courses)
});

module.exports = router;
