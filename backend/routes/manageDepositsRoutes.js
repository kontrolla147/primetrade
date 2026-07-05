const express = require("express");

const router = express.Router();

const adminAuth = require("../middleware/adminAuth");

const {
  getDeposits,

  approveDeposit,

  rejectDeposit,
} = require("../controllers/manageDepositsController");

/*==========================================================
GET ALL DEPOSITS
==========================================================*/

router.get(
  "/",

  adminAuth,

  getDeposits,
);

/*==========================================================
APPROVE DEPOSIT
==========================================================*/

router.patch(
  "/:id/approve",

  adminAuth,

  approveDeposit,
);

/*==========================================================
REJECT DEPOSIT
==========================================================*/

router.patch(
  "/:id/reject",

  adminAuth,

  rejectDeposit,
);

module.exports = router;
