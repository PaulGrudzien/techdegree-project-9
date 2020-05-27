'use strict';

const db = require('../db.js');
const express = require("express")
const asyncHandler = require("./asyncHandler.js")
const authenticateUser = require("./authenticateUser.js")

const {User, Course} = db.models;
const router = express.Router();

router.get('/courses', asyncHandler(async (req, res) => {
    const courses = await Course.findAll({order: [ ['title', 'ASC'] ]});
    for(let i=0 ; i<courses.length ; i++) {
        courses[i].owner = await User.findByPk(courses[i].userId)
    }
    res.json(courses)
}));

router.get('/courses/:id', asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id);
    if (course) {
        owner = await User.findByPk(course.userId);
        res.json(course);
    } else {
        res.status(500).json({ message: 'Server Error' });
    }
}));

module.exports = router;
