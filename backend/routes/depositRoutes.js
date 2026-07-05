const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const {
  getDeposits,

  createDeposit,

  getWallet,
} = require("../controllers/depositController");

/*==========================================================
GET USER DEPOSITS
==========================================================*/

router.get(
  "/",

  auth,

  getDeposits,
);

/*==========================================================
CREATE DEPOSIT
==========================================================*/

router.post(
  "/",

  auth,

  createDeposit,
);

/*==========================================================
GET WALLET ADDRESS
==========================================================*/

router.get(
  "/wallet/:coin",

  auth,

  getWallet,
);

module.exports = router;
