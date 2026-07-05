const Deposit = require("../models/Deposit");
const User = require("../models/User");
const createNotification = require("../utils/createNotification");
const Transaction = require("../models/Transaction");


/*==========================================================
GET ALL DEPOSITS
==========================================================*/

exports.getDeposits = async (req, res) => {
  try {
    const deposits = await Deposit.find({
      status: "Pending",
    })

      .populate(
        "user",

        "fullName username email",
      )

      .sort({
        createdAt: -1,
      });

    res.json({
      deposits,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Unable to load deposits.",
    });
  }
};

/*==========================================================
APPROVE DEPOSIT
==========================================================*/

exports.approveDeposit = async (req, res) => {
  try {
    const deposit = await Deposit.findById(req.params.id).populate("user");

    if (!deposit) {
      return res.status(404).json({
        message: "Deposit not found.",
      });
    }

    if (deposit.status !== "Pending") {
      return res.status(400).json({
        message: "Deposit already processed.",
      });
    }

    const user = await User.findById(deposit.user._id);

    user.balance += deposit.amount;

    await user.save();

    deposit.status = "Approved";

    deposit.approvedBy = req.admin.id;

    deposit.approvedAt = new Date();

    await deposit.save();
    /*==========================================================
UPDATE TRANSACTION
==========================================================*/

    await Transaction.findOneAndUpdate(
      {
        user: user._id,

        type: "Deposit",

        status: "Pending",
      },

      {
        status: "Approved",
      },

      {
        sort: {
          createdAt: -1,
        },
      },
    );

    /*==========================================================
CREATE NOTIFICATION
==========================================================*/

    await createNotification({
      user: user._id,

      title: "Deposit Approved",

      message: `Your ${deposit.coin.toUpperCase()} deposit of $${Number(deposit.amount).toLocaleString()} has been approved and credited to your account.`,

      type: "success",
    });


    /*==========================================================
CREATE ACTIVITY
==========================================================*/


    res.json({
      message: "Deposit approved successfully.",

      deposit,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error.",
    });
  }
};

/*==========================================================
REJECT DEPOSIT
==========================================================*/

exports.rejectDeposit = async (req, res) => {
  try {
    const deposit = await Deposit.findById(req.params.id);

    if (!deposit) {
      return res.status(404).json({
        message: "Deposit not found.",
      });
    }

    if (deposit.status !== "Pending") {
      return res.status(400).json({
        message: "Deposit already processed.",
      });
    }
    deposit.status = "Rejected";

    deposit.approvedBy = req.admin.id;

    deposit.approvedAt = new Date();

    await deposit.save();
    /*==========================================================
UPDATE TRANSACTION
==========================================================*/

    await Transaction.findOneAndUpdate(
      {
        user: deposit.user,

        type: "Deposit",

        status: "Pending",
      },

      {
        status: "Rejected",
      },

      {
        sort: {
          createdAt: -1,
        },
      },
    );
    /*==========================================================
CREATE NOTIFICATION
==========================================================*/

    await createNotification({
      user: deposit.user,

      title: "Deposit Rejected",

      message: `Your ${deposit.coin.toUpperCase()} deposit request of $${Number(deposit.amount).toLocaleString()} has been rejected.`,

      type: "error",
    });



    res.json({
      message: "Deposit rejected.",

      deposit,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error.",
    });
  }
};
