const express = require("express");

const router = express.Router();

const adminAuth = require("../middleware/adminAuth");

const {

    getKycRequests,

    approveKyc,

    rejectKyc

} = require("../controllers/manageKycController");

/*==========================================================
GET ALL KYC
==========================================================*/

router.get(

    "/",

    adminAuth,

    getKycRequests

);

/*==========================================================
APPROVE KYC
==========================================================*/

router.put(

    "/approve/:id",

    adminAuth,

    approveKyc

);

/*==========================================================
REJECT KYC
==========================================================*/

router.put(

    "/reject/:id",

    adminAuth,

    rejectKyc

);

module.exports = router;