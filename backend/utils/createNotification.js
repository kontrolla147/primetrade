"use strict";

const Notification = require("../models/Notification");

module.exports = async function createNotification({
  user,

  title,

  message,

  type = "info",
}) {
  try {
    return await Notification.create({
      user,

      title,

      message,

      type,
    });
  } catch (error) {
    console.error(
      "Notification Error:",

      error,
    );

    return null;
  }
};
