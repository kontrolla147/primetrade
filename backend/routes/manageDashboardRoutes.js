const express = require("express");

const router = express.Router();

const adminAuth = require("../middleware/adminAuth");

const {

    getUsers,

    searchUser,

    addProfit,

    removeProfit,

    addBonus,

    removeBonus,

    addReferral,

    removeReferral

} = require("../controllers/manageDashboardController");

/*==========================================================
GET USERS
==========================================================*/

router.get(

    "/users",

    adminAuth,

    getUsers

);

/*==========================================================
SEARCH USER
==========================================================*/

router.get(
  "/users/search",

  adminAuth,

  searchUser,
);


/*==========================================================
ADD PROFIT
==========================================================*/

router.post(

    "/profit/add",

    adminAuth,

    addProfit

);

/*==========================================================
REMOVE PROFIT
==========================================================*/

router.post(

    "/profit/remove",

    adminAuth,

    removeProfit

);
/*==========================================================
BONUS
==========================================================*/

router.post(

    "/bonus/add",

    adminAuth,

    addBonus

);

router.post(

    "/bonus/remove",

    adminAuth,

    removeBonus

);

/*==========================================================
REFERRAL
==========================================================*/

router.post(

    "/referral/add",

    adminAuth,

    addReferral

);

router.post(

    "/referral/remove",

    adminAuth,

    removeReferral

);
module.exports = router;
