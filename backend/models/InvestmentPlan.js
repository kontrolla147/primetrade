"use strict";

const mongoose = require("mongoose");

const investmentPlanSchema = new mongoose.Schema(
  {
    name: {
      type: String,

      required: true,

      trim: true,
    },

    roi: {
      type: Number,

      required: true,
    },

    duration: {
      type: Number,

      required: true,
    },

    minimum: {
      type: Number,

      required: true,
    },

    maximum: {
      type: Number,

      required: true,
    },

    badge: {
      type: String,

      default: "Standard",

      trim: true,
    },

    description: {
      type: String,

      default: "",

      trim: true,
    },

    status: {
      type: String,

      enum: ["Active", "Hidden"],

      default: "Active",
    },
  },

  {
    timestamps: true,
  },
);

module.exports = mongoose.model(
  "InvestmentPlan",

  investmentPlanSchema,
);
