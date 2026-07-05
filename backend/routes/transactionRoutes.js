const express = require("express");

const auth = require("../middleware/auth");

const {

    getTransactions,

    getTransaction

} = require("../controllers/transactionController");

const router = express.Router();

/*==========================================================
GET ALL TRANSACTIONS
==========================================================*/

router.get(

    "/",

    auth,

    getTransactions

);

/*==========================================================
GET SINGLE TRANSACTION
==========================================================*/

router.get(

    "/:id",

    auth,

    getTransaction

);

module.exports = router;