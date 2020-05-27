'use strict';

const db = require('../db.js');
const express = require("express")
const asyncHandler = require("./asyncHandler.js")
const authenticateUser = require("./authenticateUser.js")
const bcryptjs = require('bcryptjs');

const {User} = db.models;
const router = express.Router();

router.get('/users', authenticateUser, (req, res) => {
    const user = req.currentUser;
    res.json({
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.emailAddress
    });
});

router.post('/users', asyncHandler(async (req, res) => {
    const user = req.body;
    user.password = bcryptjs.hashSync(user.password);
    await User.create(user);
    // set location to "/"
    res.status(201).end();
}));


module.exports = router;
