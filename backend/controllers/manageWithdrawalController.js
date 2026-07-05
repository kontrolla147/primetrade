"use strict";

const Withdrawal = require("../models/Withdrawal");
const User = require("../models/User");
const createNotification = require("../utils/createNotification");


/*==========================================================
GET ALL PENDING WITHDRAWALS
==========================================================*/

exports.getWithdrawals = async (req, res) => {
    try {

        const withdrawals = await Withdrawal.find({
            status: "Pending"
        })
        .populate(
            "user",
            "fullName username email"
        )
        .sort({
            createdAt: -1
        });

        res.json({
            withdrawals
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Unable to load withdrawals."
        });

    }
};

/*==========================================================
APPROVE WITHDRAWAL
==========================================================*/

exports.approveWithdrawal = async (req, res) => {

    try {

        const withdrawal = await Withdrawal.findById(req.params.id);

        if (!withdrawal) {

            return res.status(404).json({
                message: "Withdrawal not found."
            });

        }

        if (withdrawal.status !== "Pending") {

            return res.status(400).json({
                message: "Withdrawal already processed."
            });

        }

        const user = await User.findById(withdrawal.user);

        if (!user) {

            return res.status(404).json({
                message: "User not found."
            });

        }

        if (user.balance < withdrawal.amount) {

            return res.status(400).json({
                message: "Insufficient user balance."
            });

        }

        /*==========================================================
        UPDATE USER
        ==========================================================*/

        user.balance -= withdrawal.amount;

        await user.save();

        /*==========================================================
        UPDATE WITHDRAWAL
        ==========================================================*/

        withdrawal.status = "Approved";

        withdrawal.progress = 100;

        withdrawal.approvedAt = new Date();

        withdrawal.approvedBy = req.admin.id;

        await withdrawal.save();

        /*==========================================================
        CREATE NOTIFICATION
        ==========================================================*/

        await createNotification({

            user: user._id,

            title: "Withdrawal Approved",

            message: `Your ${withdrawal.coin.toUpperCase()} withdrawal of $${Number(withdrawal.amount).toLocaleString()} has been approved and is being processed.`,

            type: "success"

        });

        /*==========================================================
        CREATE ACTIVITY
        ==========================================================*/

       

        res.json({

            message: "Withdrawal approved successfully."

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            message: "Unable to approve withdrawal."

        });

    }

};

/*==========================================================
REJECT WITHDRAWAL
==========================================================*/

exports.rejectWithdrawal = async (req, res) => {

    try {

        const withdrawal = await Withdrawal.findById(req.params.id);

        if (!withdrawal) {

            return res.status(404).json({

                message: "Withdrawal not found."

            });

        }

        if (withdrawal.status !== "Pending") {

            return res.status(400).json({

                message: "Withdrawal already processed."

            });

        }

        const user = await User.findById(withdrawal.user);

        if (!user) {

            return res.status(404).json({

                message: "User not found."

            });

        }

        /*==========================================================
        UPDATE WITHDRAWAL
        ==========================================================*/

        withdrawal.status = "Rejected";

        withdrawal.progress = 100;

        withdrawal.rejectionReason = req.body.reason || "";

        withdrawal.approvedAt = new Date();

        withdrawal.approvedBy = req.admin.id;

        await withdrawal.save();

        /*==========================================================
        CREATE NOTIFICATION
        ==========================================================*/

        await createNotification({

            user: withdrawal.user,

            title: "Withdrawal Rejected",

            message: withdrawal.rejectionReason

                ? `Your ${withdrawal.coin.toUpperCase()} withdrawal request of $${Number(withdrawal.amount).toLocaleString()} was rejected. Reason: ${withdrawal.rejectionReason}`

                : `Your ${withdrawal.coin.toUpperCase()} withdrawal request of $${Number(withdrawal.amount).toLocaleString()} was rejected.`,

            type: "error"

        });

        /*==========================================================
        CREATE ACTIVITY
        ==========================================================*/


        res.json({

            message: "Withdrawal rejected successfully."

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            message: "Unable to reject withdrawal."

        });

    }

};