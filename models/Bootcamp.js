const mongoose = require("mongoose");
const slugify = require("slugify");
const geocoder = require("../utils/geocoder")

const BootcampSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
    unique: true,
    trim: true,
    maxLength: [50, "Name cannot be more then 50 characters"],
  },
  slug: {
    type: String,
  },
  description: {
    type: String,
    required: [true, "Please add description"],
    maxLength: [500, "Name cannot be more than 500 characters"],
  },
  website: {
    type: String,
  },
  phone: {
    type: String,
    maxlength: [20, "Phone number cannot be longer than 20 characters"],
  },
  email: {
    type: String,
  },
  address: {
    type: String,
    required: [true, "Please add an address"],
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
    },
    coordinates: {
      type: [Number],
      index: "2dsphere",
    },
    formattedAddress: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String,
  },
  careers: {
    type: [String],
    required: true,
    enum: [
      "Web Development",
      "Mobile Development",
      "UI/UX",
      "Data Science",
      "Business",
      "Other",
    ],
  },
  averageRating: {
    type: Number,
    min: [1, "Rating must be at least 1"],
    max: [10, "Rating must cannot be more than 10"],
  },
  averageCost: Number,
  photo: {
    type: String,
    default: "no-photo.jpg",
  },
  housing: {
    type: Boolean,
    default: false,
  },
  jobAssistance: {
    type: Boolean,
    default: false,
  },
  jobGuarantee: {
    type: String,
    default: false,
  },
  acceptGi: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
},{
  toJSON : { virtuals : true },
  toObject : { virtuals : true }
});

BootcampSchema.pre("save",function(next)
{
  this.slug  = slugify(this.name,{lower:true});
  next();
})
BootcampSchema.pre("save", async function(next)
{
   const loc = await geocoder.geocode(this.address);
   this.location = {
    type : "Point",
    coordinates : [loc[0].longitude,loc[0].latitude],
    formattedAddress : loc[0].formattedAddress,
    street : loc[0].streetName,
    city:loc[0].city,
    state:loc[0].stateCode,
    zipcode:loc[0].zipcode,
    country:loc[0].countryCode
   }

  //  Do not save address in DB
  this.address = undefined;
   next();
})

// When bootcamp is deleted , the courses associated with it also deletes
BootcampSchema.pre("remove", async function(next){

  console.log(`Courses being removed from bootcamp ${this._id}`)

  await this.model("Course").deleteMany({bootcamp:this._id})
  next();
})

// Reverse populate with virtuals
// Returns the courses array of bootcamp while returning bootcamps
BootcampSchema.virtual("courses",{
  ref : "Course",
  localField : "_id",
  foreignField : "bootcamp",
  justOne : false
})


const BootcampModel = mongoose.model("Bootcamp", BootcampSchema);
module.exports = BootcampModel;
