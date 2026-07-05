const mongoose = require("mongoose");

const kycSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true,

      unique: true,
    },

    fullName: {
      type: String,

      required: true,
    },

    dateOfBirth: {
      type: Date,

      required: true,
    },

    nationality: {
      type: String,

      required: true,
    },

    documentType: {
      type: String,

      enum: ["National ID", "Passport", "Driver's License"],

      required: true,
    },

    documentNumber: {
      type: String,

      required: true,
    },

    documentImage: {
      type: String,

      required: true,
    },

    selfieImage: {
      type: String,

      required: true,
    },

    status: {
      type: String,

      enum: ["Pending", "Verified", "Rejected"],

      default: "Pending",
    },

    rejectionReason: {
      type: String,

      default: "",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("KYC", kycSchema);
