const express = require('express');
const router = express.Router();
const Course = require('../models').Course; //data


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


// ---------- GET All Courses + associated Users ----------
/* /api/courses GET route that will return all courses including the User associated with each course and a 200 HTTP status code.*/
router.get('/api/courses', asyncHandler(async(req, res) =>{
    const courses = await Course.findAll();
    res.json(courses);
    res.status(200);
}));

// ---------- GET a Course + associated Users ----------
/*
Route that will return the corresponding course including the User associated with that course and a 200 HTTP status code.
*/
router.get('/api/courses/:id', asyncHandler(async(req, res) =>{
    const course = await Course.findByPk(req.params.id);
    res.json(course);
    res.status(200);
}));

// ---------- POST a New Course ----------
/* 
A /api/courses POST route that will create a new course, set the Location header to the URI for the newly created course, and return a 201 HTTP status code and no content.
*/
router.post('/api/courses', asyncHandler(async(req, res) => {
    try {
        await Course.create(req.body);
        res.status(201).json({ "message": "Course successfully created!" });
    } catch (error){
        console.log("ERROR ", error.name);

        if(error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError'){
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });
        } else {
            throw error;
        }
    }
}));


// ---------- PUT request to Update a Course ----------
/*
A /api/courses/:id PUT route that will update the corresponding course and return a 204 HTTP status code and no content.
*/
router.put('/api/courses/:id', asyncHandler(async(req, res) => {
    let course;
    try {
        course = await Course.findByPk(req.params.id);
        if(course){
            await course.update(req.body);
            res.status(204).end();
        } 
    } catch (error){
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError'){
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });
        } else {
            throw error;
        }
    }
}));

// ---------- DELETE request to Delete a Course ----------
/**
 A /api/courses/:id DELETE route that will delete the corresponding course and return a 204 HTTP status code and no content.
 */
router.delete('/api/courses/:id', asyncHandler(async(req, res) => {
    if(course){
        const course = await Course.findByPk(req.params.id);
        await course.destroy();
        res.status(204).end();
    }
}));




module.exports = router;