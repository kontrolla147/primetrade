const express = require("express");

const auth = require("../middleware/auth");

const { getWallets } = require("../controllers/walletController");

const router = express.Router();

/*==========================================================
GET USER WALLETS
==========================================================*/

router.get(
  "/",

  auth,

  getWallets,
);

module.exports = router;
