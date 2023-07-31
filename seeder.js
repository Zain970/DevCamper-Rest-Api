const mongoose = require("mongoose");
const fs = require("fs");
const colors = require("colors");
const dotenv = require("dotenv");

// Load env vars
dotenv.config({path:"./config/config.env"});

// Load Models
const Bootcamp = require("./models/Bootcamp");
const Course = require("./models/Course");

// This Data has to be imported inside the database
// Read JSON FILES
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/data/bootcamps.json`));
const courses = JSON.parse(fs.readFileSync(`${__dirname}/data/courses.json`));


// Import into DB
const importData = async()=>{
    try
    {
        // Connecting to the database
        await mongoose.connect(process.env.MONGO_URI);

        // Creating bootcamps and courses
        await Bootcamp.create(bootcamps);   
        await Course.create(courses);

        console.log("Data Imported ....".green.inverse);
        process.exit();
    }
    catch(err)
    {
        console.error(err);
    }
}

// Delete Data
const deleteData = async ()=>{
    try
    {
        // Connecting to the database
        await mongoose.connect(process.env.MONGO_URI);

        // Deleting the data
        await Bootcamp.deleteMany();
        await Course.deleteMany();

        console.log("Data Destroyed ....".red.inverse);
        process.exit();
    }
    catch(err)
    {
        console.error(err);
    }
}

if(process.argv[2] === "-i")
{
    importData();
}
else if(process.argv[2] === "-d")
{
   deleteData();
}