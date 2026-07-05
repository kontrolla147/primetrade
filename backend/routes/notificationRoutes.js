const express = require("express");

const auth = require("../middleware/auth");

const { getNotifications } = require("../controllers/notificationController");

const router = express.Router();

/*==========================================================
GET USER NOTIFICATIONS
==========================================================*/

router.get(
  "/",

  auth,

  getNotifications,
);

module.exports = router;
