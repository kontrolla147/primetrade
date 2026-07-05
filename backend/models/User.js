const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,

      required: true,

      trim: true,
    },

    username: {
      type: String,

      required: true,

      unique: true,

      trim: true,
    },

    email: {
      type: String,

      required: true,

      unique: true,

      lowercase: true,

      trim: true,
    },

    phone: {
      type: String,

      required: true,
    },

    country: {
      type: String,

      required: true,
    },

    password: {
      type: String,

      required: true,
    },

    role: {
      type: String,

      enum: ["user", "admin"],

      default: "user",
    },

    balance: {
      type: Number,
      default: 0,
    },

    bonus: {
      type: Number,
      default: 0,
    },

    totalInvested: {
      type: Number,
      default: 0,
    },

    totalProfit: {
      type: Number,
      default: 0,
    },

    customWallets: {
      BTC: {
        type: String,

        default: "",
      },

      ETH: {
        type: String,

        default: "",
      },

      USDT_TRC20: {
        type: String,

        default: "",
      },

      USDT_ERC20: {
        type: String,

        default: "",
      },
    },
    investmentStatus: {
      type: String,
      enum: ["Inactive", "Active"],
      default: "Inactive",
    },
    referralCode: {
      type: String,
      unique: true,
      trim: true,
    },

    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

  referralBonus: {
      type: Number,

      default: 0,
    },

    notifications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Notification",
      },
    ],

    lastLogin: {
      type: Date,
    },

    profileImage: {
      type: String,

      default: "",
    },

    kycStatus: {
      type: String,

      enum: ["Pending", "Verified", "Rejected"],

      default: "Pending",
    },

    isVerified: {
      type: Boolean,

      default: false,
    },

    accountStatus: {
      type: String,

      enum: ["active", "suspended"],

      default: "active",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("User", userSchema);
