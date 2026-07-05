const express = require("express");

const auth = require("../middleware/auth");

const upload = require("../middleware/uploadKYC");

const {
  submitKYC,

  getStatus,
} = require("../controllers/kycController");

const router = express.Router();

/*==========================================================
SUBMIT KYC
==========================================================*/

router.post(
  "/",

  auth,

  upload.fields([
    {
      name: "documentImage",

      maxCount: 1,
    },

    {
      name: "selfieImage",

      maxCount: 1,
    },
  ]),

  submitKYC,
);

/*==========================================================
GET STATUS
==========================================================*/

router.get(
  "/status",

  auth,

  getStatus,
);

module.exports = router;
