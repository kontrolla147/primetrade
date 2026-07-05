const express = require("express");

const adminAuth = require("../middleware/adminAuth");

const { getActivities } = require("../controllers/activityController");

const router = express.Router();

/*==========================================================
GET ACTIVITIES
==========================================================*/

router.get(
  "/",

  adminAuth,

  getActivities,
);

module.exports = router;
