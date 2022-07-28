'use strict';

const auth = require('basic-auth');
const { User } = require('../models');
const bcrypt = require('bcrypt');

// Middleware to authenticate the request using Basic Authentication.
exports.authenticateUser = async (req, res, next) => {
    // message that will display an erro at any stage
    let message; 

    //Parse the user's credentials from the Authorization header
    const credentials = auth(req);

    if(credentials) {
        const user = await User.findOne({ where:{ emailAddress: credentials.name}});

        if(user) {
            const authenticated = bcrypt.compareSync(credentials.pass, user.confirmedPassword);

            if(authenticated) {
                console.log(`Authentication successful for username: ${user.emailAddress}`);

                //Store the user on the request object
                req.currentUser = user;
            } else {
                message = `Authentication failure for username: ${user.emailAddress}`;
            }
        } else {
            message = `User not found for username: ${credentials.emailAddress}`;
        }
    } else {
        message = `Auth header not found`;
    }

    if(message) {
        console.warn(message);
        res.status(401).json({message: 'Access Denied'});
    } else {
        next();
    }

};