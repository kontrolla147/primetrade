const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();

const {

    registerUser,

    loginUser,

    logoutUser,

    getCurrentUser

} = require("../controllers/authController");

/*=========================================
REGISTER
=========================================*/

router.post("/register", registerUser);

/*=========================================
LOGIN
=========================================*/

router.post("/login", loginUser);

router.get("/me", auth, getCurrentUser);

router.post("/logout", auth, logoutUser);

module.exports = router;
