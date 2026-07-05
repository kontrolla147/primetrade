const express = require("express");

const {
  login,

  logout,
} = require("../controllers/adminAuthController");

const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

/*==========================================================
LOGIN
==========================================================*/

router.post(
  "/login",

  login,
);

/*==========================================================
LOGOUT
==========================================================*/

router.post(
  "/logout",

  adminAuth,

  logout,
);

/*==========================================================
VERIFY SESSION
==========================================================*/

router.get(
  "/verify",

  adminAuth,

  (req, res) => {
    res.json({
      authenticated: true,
    });
  },
);

module.exports = router;
