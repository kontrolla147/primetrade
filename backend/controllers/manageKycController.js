const KYC = require("../models/KYC");

const User = require("../models/User");

/*==========================================================
GET ALL KYC REQUESTS
==========================================================*/

exports.getKycRequests = async (req, res) => {

    try {

        const kyc = await KYC.find()

            .populate(

                "user",

                "username email"

            )

            .sort({

                createdAt: -1

            });

        res.json({

            kyc

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            message: "Unable to load KYC requests."

        });

    }

};

/*==========================================================
APPROVE KYC
==========================================================*/

exports.approveKyc = async (req, res) => {

    try {

        const kyc = await KYC.findById(

            req.params.id

        );

        if (!kyc) {

            return res.status(404).json({

                message: "KYC not found."

            });

        }

        kyc.status = "Verified";

        kyc.rejectionReason = "";

        await kyc.save();

        await User.findByIdAndUpdate(

            kyc.user,

            {

                kycStatus: "Verified"

            }

        );

        res.json({

            message: "KYC approved successfully."

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            message: "Server Error"

        });

    }

};

/*==========================================================
REJECT KYC
==========================================================*/

exports.rejectKyc = async (req, res) => {

    try {

        const { reason } = req.body;

        const kyc = await KYC.findById(

            req.params.id

        );

        if (!kyc) {

            return res.status(404).json({

                message: "KYC not found."

            });

        }

        kyc.status = "Rejected";

        kyc.rejectionReason =

            reason || "Verification failed.";

        await kyc.save();

        await User.findByIdAndUpdate(

            kyc.user,

            {

                kycStatus: "Rejected"

            }

        );

        res.json({

            message: "KYC rejected."

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            message: "Server Error"

        });

    }

};