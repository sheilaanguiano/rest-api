const express = require('express');
const router = express.Router();
const Course = require('../models').Course;
const User = require('../models').User; 
const { asyncHandler } = require('../middleware/async-handler');
const { authenticateUser } = require('../middleware/auth-user');


// ---------- GET All Courses with Associated Users ---------- TESTED
/* /courses GET route that will return all courses including the User associated with each course and a 200 HTTP status code.*/
router.get('/courses', asyncHandler(async(req, res) =>{
    const courses = await Course.findAll({
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        },
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName'],
                as: 'user',
            },

        ],
    });
    res.json(courses);
    res.status(200);
}));



// ---------- GET a Course + associated Users ---------- TESTED
/*
Route that will return the corresponding course including the User associated with that course and a 200 HTTP status code.
*/
router.get('/courses/:id', asyncHandler(async(req, res) =>{
    const course = await Course.findByPk(req.params.id, {
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        },
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName'],
                as: 'user',
            },
        ],
       
    });
    res.json(course).status(200).end();
    
}));

// ---------- PROTECTED ROUTE:  POST a Course ---------- TESTED
/* 
A /api/courses POST route that will create a new course, set the Location header to the URI for the newly created course, and return a 201 HTTP status code and no content.
*/
router.post('/courses', authenticateUser, asyncHandler(async(req, res) => {
    const user = req.currentUser;
    let course;
    try {
        course = await Course.create(req.body);
        res.status(201).location(`/courses/${course.id}`).end();
    
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
    const course = await Course.findByPk(req.params.id);
    if(course) {
        if(req.currentUser.id === course.userId) {
            await course.destroy();
            res.status(204).json({'message': 'Coursed deleted'}).end();
        } else {
            res.status(403).json({ "mesage": "You're not authorized to delete this course" });
        }
    } else {
        res.status(404).json({"message": "Course not found"});
    }

}));




module.exports = router;