const express = require('express');
const router = express.Router();
const Course = require('../models').Course;
const User = require('../models').User; 
const { asyncHandler } = require('../middleware/async-handler');
const { authenticateUser } = require('../middleware/auth-user');


// ---------- GET All Courses + associated Users ----------
/* /courses GET route that will return all courses including the User associated with each course and a 200 HTTP status code.*/
router.get('/courses', asyncHandler(async(req, res) =>{
    const courses = await Course.findAll({
        include: [
            {
                model: User,
                as: 'user',
            },
        ],
    });
    res.json(courses);
    res.status(200);
}));



// ---------- GET a Course + associated Users ----------
/*
Route that will return the corresponding course including the User associated with that course and a 200 HTTP status code.
*/
router.get('/courses/:id', asyncHandler(async(req, res) =>{
    const course = await Course.findByPk(req.params.id);
    res.json(course);
    res.status(200);
}));

// ---------- PROTECTED ROUTE:  POST a Course ----------
/* 
A /api/courses POST route that will create a new course, set the Location header to the URI for the newly created course, and return a 201 HTTP status code and no content.
*/
router.post('/courses', authenticateUser, asyncHandler(async(req, res) => {
    const user = req.currentUser;

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


// ---------- PROTECTED ROUTE:  PUT REQUEST to UPDATE a Course ----------
/*
A /api/courses/:id PUT route that will update the corresponding course and return a 204 HTTP status code and no content.
*/
router.put('/courses/:id', authenticateUser, asyncHandler(async(req, res) => {
    const user = req.currentUser;

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

// ----------PROTECTED ROUTE:  DELETE REQUEST to Delete a Course ----------
/**
 A /api/courses/:id DELETE route that will delete the corresponding course and return a 204 HTTP status code and no content.
 */
router.delete('/courses/:id', authenticateUser, asyncHandler(async(req, res) => {
    const user = req.currentUser;
    
    if(course){
        const course = await Course.findByPk(req.params.id);
        await course.destroy();
        res.status(204).end();
    }
}));




module.exports = router;