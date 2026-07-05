const express = require("express");

const auth = require("../middleware/auth");

const {
  createWithdrawal,

  getWithdrawals,
} = require("../controllers/withdrawController");

const router = express.Router();

/*==========================================================
CREATE WITHDRAWAL
==========================================================*/

router.post(
  "/",

  auth,

  createWithdrawal,
);

/*==========================================================
GET USER WITHDRAWALS
==========================================================*/

router.get(
  "/",

  auth,

  getWithdrawals,
);

module.exports = router;
