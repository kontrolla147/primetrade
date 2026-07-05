const express = require("express");

const router = express.Router();

const adminAuth = require("../middleware/adminAuth");

const {

    getUsers,

    getUser,

    updateUser,

    updateWallets,

    toggleStatus,

    approveKyc,

    rejectKyc,

    deleteUser,

    loginAsUser

} = require("../controllers/manageUsersController");

/*==========================================================
GET ALL USERS
==========================================================*/

router.get(

    "/",

    adminAuth,

    getUsers

);

/*==========================================================
GET SINGLE USER
==========================================================*/

router.get(

    "/:id",

    adminAuth,

    getUser

);

/*==========================================================
UPDATE USER
==========================================================*/

router.put(

    "/:id",

    adminAuth,

    updateUser

);

/*==========================================================
UPDATE CUSTOM WALLETS
==========================================================*/

router.put(

    "/:id/wallets",

    adminAuth,

    updateWallets

);

/*==========================================================
SUSPEND / ACTIVATE
==========================================================*/

router.patch(

    "/:id/status",

    adminAuth,

    toggleStatus

);

/*==========================================================
APPROVE KYC
==========================================================*/

router.patch(

    "/:id/kyc/approve",

    adminAuth,

    approveKyc

);

/*==========================================================
REJECT KYC
==========================================================*/

router.patch(

    "/:id/kyc/reject",

    adminAuth,

    rejectKyc

);

/*==========================================================
DELETE USER
==========================================================*/

router.delete(

    "/:id",

    adminAuth,

    deleteUser

);

/*==========================================================
LOGIN AS USER
==========================================================*/

router.post(

    "/:id/login-as",

    adminAuth,

    loginAsUser

);

module.exports = router;