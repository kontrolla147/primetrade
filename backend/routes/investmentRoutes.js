const express = require("express");

const auth = require("../middleware/auth");

const {
  createInvestment,

  getInvestments,
} = require("../controllers/investmentController");

const router = express.Router();

/*==========================================================
CREATE INVESTMENT
==========================================================*/

router.post(
  "/",

  auth,

  createInvestment,
);

/*==========================================================
GET USER INVESTMENTS
==========================================================*/

router.get(
  "/",

  auth,

  getInvestments,
);

module.exports = router;
