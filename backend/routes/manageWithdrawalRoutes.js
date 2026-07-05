"use strict";

const express = require("express");

const auth = require("../middleware/auth");

const adminAuth = require("../middleware/adminAuth");

const {
  getWithdrawals,

  approveWithdrawal,

  rejectWithdrawal,
} = require("../controllers/manageWithdrawalController");

const router = express.Router();

/*==========================================================
GET ALL WITHDRAWALS
==========================================================*/

router.get(
  "/",

  auth,

  adminAuth,

  getWithdrawals,
);

/*==========================================================
APPROVE
==========================================================*/

router.put(
  "/approve/:id",

  auth,

  adminAuth,

  approveWithdrawal,
);

/*==========================================================
REJECT
==========================================================*/

router.put(
  "/reject/:id",

  auth,

  adminAuth,

  rejectWithdrawal,
);

module.exports = router;
