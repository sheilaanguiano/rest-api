const express = require('express');
const router = express.Router();
const User = require('../models').User; //data
const { asyncHandler } = require('../middleware/async-handler');
const { authenticateUser } = require('../middleware/auth-user');




// ---------- PROTECTED ROUTE: GET Authenticated User ---------- TESTED
/* route that will return all properties and values for the currently authenticated User along with a 200 HTTP status code.*/

router.get('/users', authenticateUser, asyncHandler(async(req, res) => { 
    //get the user from the request body
    const user = req.currentUser;
    
    res.status(200).json({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.emailAddress,
        password: user.password,
    });  
}));


// ---------- POST User ----------------------
/*
POST route that will create a new user, set the Location header to "/", and return a 201 HTTP status code and no content.
*/
router.post('/users', asyncHandler(async(req, res) => {
    let user;
    try {
     user = await User.create(req.body);
      res.location('/').status(201).end();
        
    } catch (error) {
        if(error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError'){
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });
        } else {
            throw error;
        }
    }
}));

module.exports = router;