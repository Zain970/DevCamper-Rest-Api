const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err , req , res , next)=>{

    let error = {...err};
    error.message  = err.message;

    // Mongoose bad ObjectId
    if(err.name === "CastError")
    {
        const message = `Bootcamp not found with id of ${err.value}`;

        // Making an object of ErrorResponse class
        error = new ErrorResponse(message,404);
    }

    // Mongoose duplicate error
    if(err.code == 11000){
        const message  = "Duplicate field value entered";

        // Making an object of ErrorResponse Class
        error = new ErrorResponse(message,400);
    }

    // Mongoose validation error
    if(err.name == "ValidationError")
    {
        const message  = Object.values(err.errors).map((value)=>{
            return value.message
        })

        // Making an object of ErrorResponse Class
        error = new ErrorResponse(message,400);
    }

    // Sending the response
    res.status(error.statusCode || 500).json({
        success : false,
        error : error.message || "Server Error"
    })

}

module.exports = errorHandler;