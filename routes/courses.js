const express = require("express");

const {
  getCourse,
  getCourses,
  updateCourse,
  deleteCourse,
  addCourse
} = require("../controllers/courses");

const router = express.Router({mergeParams:true});


// /bootcamps/:bootcampId/courses is routed to this getCourses route if GET
// /bootcamps/:bootcampId/courses is routed to this addCourse route if POST
router.route("/").get(getCourses).post(addCourse)



router
  .route("/:id")
  .get(getCourse)
  .delete(deleteCourse)
  .put(updateCourse);

module.exports = router;
