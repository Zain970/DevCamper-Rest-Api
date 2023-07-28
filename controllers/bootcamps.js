const Bootcamp = require("../models/Bootcamp");

// @desc     Get all bootcamps
// @route    Get /api/v1/bootcamps
// @access   Public

const getBootcamps = async (req, res, next) => {
  try 
  {
    const bootcamps = await Bootcamp.find({});
    res.status(200).json({
        success : true,
        totalBootcamps : bootcamps.length,
        data : bootcamps,
      });
  } 
  catch (error) 
  {
    res.status(400).json({
      success: false,
    });
  }
};

// @desc     Get single bootcamps
// @route    Get /api/v1/bootcamps/:id
// @access   Public
const getBootcamp = async(req, res, next) => {
  try 
  {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if(!bootcamp){
        return res.status(400).json({
            success:false
        })
    }

    res.status(200).json({
        success: true,
        data: bootcamp
      });
  } 
  catch (error) 
  {
    res.status(400).json({
        success: false,
      });
  }
};

// @desc     Create new bootcamp
// @route    POST /api/v1/bootcamps/
// @access   Private
const createBootcamp = async (req, res) => {
  try 
  {
    // Creating a new boot-camp
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({
      success: true,
      data: bootcamp,
    });
  } 
  catch (error) 
  {
    res.status(400).json({
      success: false,
      msg: "Error",
    });
  }
};

// @desc     Delete bootcamp
// @route    Delete /api/v1/bootcamps/:id
// @access   Private

const deleteBootcamp = async (req, res) => {
    try
    {
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)
        if(!bootcamp)
        {
            return res.status(400).json({
                success:false
            })
        }
        res.status(200).json({
            success: true,
            data: {}
          });
    }
    catch(error)
    {
        res.status(400).json({
            success: false,
          });
    }
};


// @desc     Update bootcamp
// @route    UPDATE /api/v1/bootcamps/:id
// @access   Private
const updateBootcamp = async (req, res) => {
    try
    {
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        if(!bootcamp)
        {
            
            return res.status(400).json({
                success:false
            })
        } 
        res.status(200).json({
            success: true,
            data: bootcamp,
          });
    }
    catch(error)
    {
        return res.status(400).json({
            success:false
        })
    }
  };
  
module.exports = {
  getBootcamps,
  updateBootcamp,
  deleteBootcamp,
  getBootcamp,
  createBootcamp,
};
