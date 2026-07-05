const mongoose = require("mongoose");

const investmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true,
    },

    plan: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "InvestmentPlan",

      required: true,
    },

    planName: {
      type: String,

      required: true,
    },

    amount: {
      type: Number,

      required: true,
    },

    roi: {
      type: Number,

      required: true,
    },

    expectedProfit: {
      type: Number,

      required: true,
    },

    totalReturn: {
      type: Number,

      required: true,
    },

    duration: {
      type: Number,

      required: true,
    },

    startDate: {
      type: Date,

      default: null,
    },

    endDate: {
      type: Date,

      default: null,
    },

    progress: {
  type: Number,

  default: 0,
},

    status: {
      type: String,

      enum: ["Running", "Completed"],

      default: "Running",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Investment", investmentSchema);
