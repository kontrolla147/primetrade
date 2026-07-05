const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true,
    },

    type: {
      type: String,

      enum: [
        "Deposit",

        "Withdrawal",

        "Investment",

        "Investment Profit",

        "Bonus",

        "Referral Bonus",
      ],

      required: true,
    },

    amount: {
      type: Number,

      required: true,
    },

    status: {
      type: String,

      enum: [
        "Pending",

        "Approved",

        "Rejected",

        "Running",

        "Completed",

        "Credited",
      ],

      default: "Pending",
    },

    reference: {
      type: String,

      required: true,

      unique: true,
    },

    description: {
      type: String,

      default: "",
    },

    wallet: {
      type: String,

      default: "",
    },

    coin: {
      type: String,

      default: "",
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      default: null,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Transaction", transactionSchema);
