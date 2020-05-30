'use strict';

const db = require('../db.js');
const express = require("express")
const asyncHandler = require("./asyncHandler.js")
const authenticateUser = require("./authenticateUser.js")

const {User, Course} = db.models;
const router = express.Router();

// this function validate a update or create request by verifing if all necessary fields are set.
function validateCourse(course) {
    const errors = [];
    if (!course.title || course.title == '') {
        errors.push('`Title` is required');
    }
    if (!course.description || course.description == '') {
        errors.push('`Description` is required');
    }
    if (errors.length) {
        const error = new Error(errors.join(" - "));
        error.status = 400;
        throw error;
    }
}

// this function replace the attribut userId by the attribut owner containing an user object
async function appendUser(course) {
    const {userId, ...values} = course.dataValues;
    const owner = await User.findOne({
        attributes: ['firstName', 'lastName', 'emailAddress'],
        where : { id: userId }
    });
    return {...values, owner};
}


// list all courses. No auth
router.get('/courses', asyncHandler(async (req, res) => {
    const courses = await Course.findAll({
        attributes: ['id', 'title', 'description', 'estimatedTime', 'materialsNeeded', 'userId'],
        order: [ ['title', 'ASC'] ]
    });
    if (courses) {
        Promise.all(courses.map(appendUser))
            .then(courses => res.json(courses))
    } else {
        throw new Error('Server Error')
    }
}));

// create a course. Auth needed
router.post('/courses', authenticateUser, asyncHandler(async (req, res) => {
    const user = req.currentUser;
    const course = req.body;
    course.userId = user.id;
    validateCourse(course)
    const courseData = await Course.create(course);
    res.location(`/course/${courseData.id}`).status(201).end();
}));

// get a course by id. No auth
router.get('/courses/:id', asyncHandler(async (req, res) => {
    const course = await Course.findOne({
        attributes: ['title', 'description', 'estimatedTime', 'materialsNeeded', 'userId'],
        where : { id: req.params.id }
    });
    if (course) {
        const result = await appendUser(course)
        res.json(result);
    } else {
        throw new Error('Server Error')
    }
}));

// update a course. Auth needed
router.put('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
    const user = req.currentUser;
    validateCourse(req.body);
    const course = await Course.findByPk(req.params.id);
    if (course) {
        if (course.userId == user.id) {
            await course.update(req.body);
            res.location('/').status(204).end();
        } else {
            const error = new Error('You are not allowed to update this course!')
            error.status = 403
            throw error
        }
    } else {
        throw new Error('Server Error')
    }
}));

// delete a course. Auth needed
router.delete('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
    const user = req.currentUser;
    const course = await Course.findByPk(req.params.id);
    if (course) {
        if (course.userId == user.id) {
            await course.destroy();
            res.location('/').status(204).end();
        } else {
            const error = new Error('You are not allowed to delate this course!')
            error.status = 403
            throw error
        }
    } else {
        throw new Error('Server Error')
    }
}));

module.exports = router;
