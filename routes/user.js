const express = require('express');
const router = express.Router();
const User = require('../models').User; //data
const { asyncHandler } = require('../middleware/async-handler');
const { authenticateUser } = require('../middleware/auth-user');




// ---------- PROTECTED ROUTE: GET Authenticated User ----------
/* route that will return all properties and values for the currently authenticated User along with a 200 HTTP status code.*/

router.get('/users', authenticateUser, asyncHandler(async(req, res) => { 
    //get the user from the request body
    const user = req.currentUser;
    
    res.status(200).json({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.emailAddress,
    });  
}));


// ---------- POST User ----------
/*
POST route that will create a new user, set the Location header to "/", and return a 201 HTTP status code and no content.
*/
router.post('/users', asyncHandler(async(req, res) => {
    try {
        let user = await User.create(req.body);
        res.status(201).location('/').end();
        
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