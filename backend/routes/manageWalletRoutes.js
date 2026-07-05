const express = require("express");

const router = express.Router();

const adminAuth = require("../middleware/adminAuth");

const {
  getWallets,

  saveWallets,
} = require("../controllers/manageWalletController");

/*==========================================================
GET WALLETS
==========================================================*/

router.get(
  "/",

  adminAuth,

  getWallets,
);

/*==========================================================
SAVE WALLETS
==========================================================*/

router.put(
  "/",

  adminAuth,

  saveWallets,
);

module.exports = router;
