'use strict';

const db = require('../db.js');
const express = require("express")
const asyncHandler = require("./asyncHandler.js")
const authenticateUser = require("./authenticateUser.js")
const bcryptjs = require('bcryptjs');

const {User} = db.models;
const router = express.Router();

// return user's info. Auth needed
router.get('/users', authenticateUser, (req, res, next) => {
    const user = req.currentUser;
    res.json({
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.emailAddress
    });
});

// create user. No auth
router.post('/users', asyncHandler(async (req, res, next) => {
    const user = req.body;
    if (user.password) {
        user.password = bcryptjs.hashSync(user.password);
    } else {
        const error = new Error('`Password` is required');
        error.status = 400;
        throw error;
    }
    await User.create(user);
    res.location('/').status(201).end();
}));


module.exports = router;
