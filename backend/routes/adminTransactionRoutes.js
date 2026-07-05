"use strict";

const express = require("express");

const router = express.Router();

const adminAuth = require("../middleware/adminAuth");

const {
  getTransactions,

  getTransaction,
} = require("../controllers/adminTransactionController");

/*==========================================================
GET ALL TRANSACTIONS
==========================================================*/

router.get(
  "/",

  adminAuth,

  getTransactions,
);

/*==========================================================
GET SINGLE TRANSACTION
==========================================================*/

router.get(
  "/:id",

  adminAuth,

  getTransaction,
);

module.exports = router;
