"use strict";

const express = require("express");

const router = express.Router();

const investmentPlanController = require("../controllers/adminInvestmentPlanController");

/*==========================================================
GET ACTIVE PLANS
==========================================================*/

router.get(
  "/",

  investmentPlanController.getActivePlans,
);

module.exports = router;
