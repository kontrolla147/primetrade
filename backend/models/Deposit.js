const mongoose = require("mongoose");

const depositSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true,
    },

    amount: {
      type: Number,

      required: true,
    },

    coin: {
      type: String,

      enum: ["BTC", "ETH", "USDT_TRC20", "USDT_ERC20"],

      required: true,
    },

    walletAddress: {
      type: String,

      required: true,
    },

    status: {
      type: String,

      enum: ["Pending", "Approved", "Rejected"],

      default: "Pending",
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      default: null,
    },

    approvedAt: {
      type: Date,

      default: null,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model(
  "Deposit",

  depositSchema,
);
