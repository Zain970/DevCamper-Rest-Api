const Bootcamp = require("../models/Bootcamp");
const asyncHandler=require("../middleware/async");
const ErrorResponse=require("../utils/errorResponse");
const geocoder = require("../utils/geocoder");

// @desc     Get all bootcamps
// @route    Get /api/v1/bootcamps
// @access   Public

const getBootcamps = asyncHandler( async (req, res, next) => {

  // We will be adding all the stuff to this query and then await on this to get the result
  let query ;

  // Copy req.query
  const reqQuery = {...req.query}

  // Fields to exclude
  const removeFields = ["select","sort","page","limit"];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach((param)=>{
    delete reqQuery[param];
  })

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt , $gte etc )
  queryStr  = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g,(match)=>{
    return  `$${match}`
  });

  // Finding resource 
  query = Bootcamp.find(JSON.parse(queryStr)).populate("courses")

  // 1).Projection
  if(req.query.select)
  {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  // 2).Sorting ---------------
  if(req.query.sort)
  {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  }
  else
  {
    query = query.sort("-createdAt");
  }

  // 3).Pagination ------------
  const page = req.query.page || 1;
  const limit = req.query.limit || 3;
  const startIndex = ( page - 1 )  * limit;
  const endIndex = page * limit;
  const total = await Bootcamp.countDocuments();

  console.log("Start Index : ",startIndex);
  console.log("End Index : ",endIndex);

  query = query.skip(startIndex).limit(limit);

  // Executing the query
  const bootcamps = await query;

  // Pagination result
  const pagination = {

  }

  if(endIndex < total)
  {
    pagination.next = {
      page : parseInt(page) + 1,
      limit : limit
    }
  }
  if(startIndex > 0)
  {
    pagination.previous = {
      page : parseInt(page) - 1,
      limit : limit
    }
  }

  res.status(200).json({
      success : true,
      count : bootcamps.length,
      pagination : pagination,
      data : bootcamps,
    });
})

// @desc     Get single bootcamps
// @route    Get /api/v1/bootcamps/:id
// @access   Public
const getBootcamp = asyncHandler( async(req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);


    if(!bootcamp)
    {
      return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404))
    }

    res.status(200).json({
            success: true,
            data: bootcamp
    });
})

// @desc     Create new bootcamp
// @route    POST /api/v1/bootcamps/
// @access   Private
const createBootcamp = asyncHandler( async (req, res,next) => {
  
    // Creating a new boot-camp
    const bootcamp = await Bootcamp.create(req.body);


    res.status(201).json({
      success: true,
      data: bootcamp,
    });
  
})

// @desc     Delete bootcamp
// @route    Delete /api/v1/bootcamps/:id
// @access   Private

const deleteBootcamp = asyncHandler( async (req, res,next) => {
    
      const bootcamp = await Bootcamp.findById(req.params.id)
        
      if(!bootcamp)
      {
          return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404))
      }

      // Trigger the middleware to delete all the courses associated with this bootcamp
      bootcamp.remove();

      res.status(200).json({
          success: true,
          data: {}
      });
})


// @desc     Update bootcamp
// @route    UPDATE /api/v1/bootcamps/:id
// @access   Private
const updateBootcamp = asyncHandler( async (req, res,next) => {
    
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})

    if(!bootcamp)
    {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404))
    }
    res.status(200).json({
            success: true,
            data: bootcamp,
        });
  })

// @desc     Get bootcamps within  a radius
// @route    GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access   Private
const getBootcampsInRadius = asyncHandler (async(req,res,next)=>{
  const {zipcode,distance} = req.params;

  // Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode);

  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  const radius = distance / 3963;


  const bootcamps = await Bootcamp.find({
    location : {$geoWithin:{$centerSphere : [[lng,lat ],radius]}}
  });

  res.status(200).json({
    success : true,
    length : bootcamps.length,
    data : bootcamps
  })

})
  
module.exports = {
  getBootcamps,
  updateBootcamp,
  deleteBootcamp,
  getBootcamp,
  createBootcamp,
  getBootcampsInRadius
};
