const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const Course = require("../models/Course");
const Bootcamp = require("../models/Bootcamp");

// @desc     Get courses
// @route    GET /api/v1/courses
// @route    Get /api/v1/bootcamps/:bootcampId/courses
// @access   Public

// If bootcampId is present then return courses of that particular bootcamp and if bootcampId is not present then return all the courses simply
// If bootcampId is not present then return all the courses
const getCourses = asyncHandler(async(req , res , next)=>{
    let query;

    if(req.params.bootcampId)
    {
        query = Course.find({bootcamp : req.params.bootcampId})
    }
    else
    {
        query = Course.find().populate({
            path:"bootcamp",
            select:"name description"
        });
    }

    // Executing the query
    const courses = await query;

    res.status(200).json({
        success : true,
        count : courses.length,
        data : courses
    })
})

// @desc     Get course
// @route    Get /api/v1/courses/:id
// @access   Public
const getCourse = asyncHandler(async(req,res,next)=>{

    const course = await Course.findById(req.params.id).populate({
        path:"bootcamp",
        select:"name description"
    })

    if(!course)
    {
        return next(new ErrorResponse(`No course with the id of ${req.params.id}`,404))
    }

    res.status(200).json({
        success : true,
        data : course
    })
})

// @desc     Add Course
// @route    Get /api/v1/bootcamps/:bootcampId/courses
// @access   Private
const addCourse = asyncHandler(async(req,res,next)=>{

    req.body.bootcamp = req.params.bootcampId;

    // First check if the bootcamp to which we are adding course is present or not
    const bootcamp = await Bootcamp.findById(req.params.bootcampId);

    // If bootcamp not found
    if(!bootcamp)
    {
        return next(new ErrorResponse(`No bootcamp with the id of ${req.params.bootcampId}`));
    }

    const course =  Course.create(req.body);

    res.status(200).json({
        success : true,
        data : course
    })
})

// @desc     Delete Course
// @route    Get /api/v1/courses/:id
// @access   Public
const deleteCourse = asyncHandler(async(req,res,next)=>{

    // Finding the course
    const course = await Course.findById(req.params.id);

    // If course not found with that id
    if(!course){
        return next(new ErrorResponse(`No course with id of ${req.params.id}`),404)
    }

    // Now deleting the course
    await course.deleteOne();

    res.status(200).json({
        success:true,
        data:{}
    })

})

// @desc     Update Course
// @route    Get /api/v1/courses/:id
// @access   Public
const updateCourse = asyncHandler(async (req , res , next)=>{

    // Finding the course
    let course = await Course.findById(req.params.id);

    if(!course){
        return next(new ErrorResponse(`No course with id of ${req.params.id}`),404)
    }

    course =  await  Course.findByIdAndUpdate(req.params.id,req.body,{
        new : true,
        runValidators : true
    })

    res.status(200).json({
        success:true,
        data:course
    })

})

module.exports = {
    getCourse,
    getCourses,
    deleteCourse,
    updateCourse,
    addCourse
}