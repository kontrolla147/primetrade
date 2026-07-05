"use strict";

const express = require("express");

const router = express.Router();

const adminAuth = require("../middleware/adminAuth");

const investmentPlanController = require("../controllers/adminInvestmentPlanController");

/*==========================================================
GET ALL PLANS
==========================================================*/

router.get(
  "/",

  adminAuth,

  investmentPlanController.getPlans,
);

/*==========================================================
CREATE PLAN
==========================================================*/

router.post(
  "/",

  adminAuth,

  investmentPlanController.createPlan,
);

/*==========================================================
UPDATE PLAN
==========================================================*/

router.put(
  "/:id",

  adminAuth,

  investmentPlanController.updatePlan,
);

/*==========================================================
HIDE / ACTIVATE PLAN
==========================================================*/

router.patch(
  "/:id/toggle",

  adminAuth,

  investmentPlanController.togglePlan,
);

/*==========================================================
DELETE PLAN
==========================================================*/

router.delete(
  "/:id",

  adminAuth,

  investmentPlanController.deletePlan,
);

module.exports = router;
