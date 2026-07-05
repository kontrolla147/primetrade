const KYC = require("../models/KYC");

const User = require("../models/User");

const { uploadBuffer } = require("../config/cloudinary");

exports.submitKYC = async (req, res) => {
  try {
    let existing = await KYC.findOne({
      user: req.user.id,
    });

    if (existing && existing.status === "Pending") {
      return res.status(400).json({
        message: "Your KYC is already under review.",
      });
    }

    if (!req.files || !req.files.documentImage || !req.files.selfieImage) {
      return res.status(400).json({
        message: "Please upload both document and selfie.",
      });
    }

    const documentUpload = await uploadBuffer(
      req.files.documentImage[0].buffer,

      "PrimeTrade/KYC/Documents",
    );

    const selfieUpload = await uploadBuffer(
      req.files.selfieImage[0].buffer,

      "PrimeTrade/KYC/Selfies",
    );

    if (existing) {
      existing.fullName = req.body.fullName;

      existing.dateOfBirth = req.body.dateOfBirth;

      existing.nationality = req.body.nationality;

      existing.documentType = req.body.documentType;

      existing.documentNumber = req.body.documentNumber;

      existing.documentImage = documentUpload.secure_url;

      existing.selfieImage = selfieUpload.secure_url;

      existing.status = "Pending";

      existing.rejectionReason = "";

      await existing.save();
    } else {
      await KYC.create({
        user: req.user.id,

        fullName: req.body.fullName,

        dateOfBirth: req.body.dateOfBirth,

        nationality: req.body.nationality,

        documentType: req.body.documentType,

        documentNumber: req.body.documentNumber,

        documentImage: documentUpload.secure_url,

        selfieImage: selfieUpload.secure_url,

        status: "Pending",
      });
    }

    await User.findByIdAndUpdate(
      req.user.id,

      {
        kycStatus: "Pending",
      },
    );

    res.json({
      message: "KYC submitted successfully.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Unable to submit KYC.",
    });
  }
};

exports.getStatus = async (req, res) => {

    try {

        const kyc = await KYC.findOne({

            user: req.user.id

        });

        if (!kyc) {

            return res.json({

                status: "Not Submitted",

                reason: ""

            });

        }

        res.json({

            status: kyc.status,

            reason: kyc.rejectionReason

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            message: "Server Error"

        });

    }

};