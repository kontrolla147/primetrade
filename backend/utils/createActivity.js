const Activity = require("../models/Activity");

/*==========================================================
CREATE ACTIVITY
==========================================================*/

module.exports = async function createActivity({
  admin,

  action,

  target = "",

  description,

  ipAddress = "",

  userAgent = "",
}) {
  try {
    await Activity.create({
      admin,

      action,

      target,

      description,

      ipAddress,

      userAgent,
    });
  } catch (error) {
    console.error("Activity Log Error:", error);
  }
};
