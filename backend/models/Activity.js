const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true,
    },

    action: {
      type: String,

      required: true,

      trim: true,
    },

    target: {
      type: String,

      default: "",
    },

    description: {
      type: String,

      required: true,
    },

    ipAddress: {
      type: String,

      default: "",
    },

    userAgent: {
      type: String,

      default: "",
    },
  },

  {
    timestamps: true,
  },
);

module.exports = mongoose.model(
  "Activity",

  activitySchema,
);
