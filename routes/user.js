const express = require('express');
const router = express.Router();
const User = require('../models').User; //data


//---------Handler function to wrap each route
function asyncHandler(callback){
    return async(req, res, next)=>{
      try{
          await callback(req, res, next);
          } catch(err){
              res.render('error', {error:err});
          }	
      }
  }

// ---------- GET Aunthenticated User ----------
/* route that will return all properties and values for the currently authenticated User along with a 200 HTTP status code.*/
router.get('/api/users', asyncHandler(async(req, res) => {
    //get the user from the request body
    const user = req.body;
    res.status(200);
}));


// ---------- POST Aunthenticated User ----------
/*
POST route that will create a new user, set the Location header to "/", and return a 201 HTTP status code and no content.
*/
router.post('/api/users', asyncHandler(async(req, res) => {
    try {
        await User.create(req.body);
        res.status(201).json({"message": "Account successfully created!"});
    } catch (error){
        console.log('ERROR ', error.name);
        
    }
}));

module.exports = router;