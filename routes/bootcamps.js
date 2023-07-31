const express = require("express");

const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  deleteBootcamp,
  updateBootcamp,
  getBootcampsInRadius,
} = require("../controllers/bootcamps");


// Include other resource routers
const courseRouter = require("./courses");

const router = express.Router();

// Routed to the course router
// @route /bootcamps/:bootcampId/courses :- routed to the course router
// If this url route/mount to the course router
router.use("/:bootcampId/courses",courseRouter);

// Get all bootcamps in a particular distance of a zip code
router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);

// 1).Get all bootcamps
// 2).Create bootcamp
router.route("/").get(getBootcamps).post(createBootcamp);


router
  .route("/:id")
  .get(getBootcamp)
  .delete(deleteBootcamp)
  .put(updateBootcamp);

module.exports = router;
