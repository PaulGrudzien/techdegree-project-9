'use strict';

const db = require('../db.js');
const asyncHandler = require("./asyncHandler.js")
const auth = require('basic-auth');
const bcryptjs = require('bcryptjs');

const {User} = db.models;

async function authenticateUser(req, res, next) {
    let message = null;
    const credentials = auth(req);
    if (credentials) {
        const user = await User.findOne({ where: { emailAddress: credentials.name } });
        if (user) {
            const authenticated = bcryptjs.compareSync(credentials.pass, user.password);
            if (authenticated) {
                req.currentUser = user;
            } else {
                message = `Authentication failure for username: ${user.username}`;
            }
        } else {
            message = `User not found for username: ${credentials.name}`;
        }
    } else {
        message = 'Auth header not found';
    }
    
    if (message) {
        const error = new Error('Access Denied');
        error.status = 401;
        next(error)
        
    } else {
        next();
    }
}

module.exports =  authenticateUser;
