const Withdrawal = require("../models/Withdrawal");
const createTransaction = require("../utils/createTransaction");
const User = require("../models/User");
const createNotification = require("../utils/createNotification");


exports.createWithdrawal = async (req, res) => {
  try {
    const { amount, coin, walletAddress } = req.body;

    if (!amount || !coin || !walletAddress) {
      return res.status(400).json({
        message: "Please complete all fields.",
      });
    }

    const withdrawalAmount = Number(amount);

    if (withdrawalAmount <= 0) {
      return res.status(400).json({
        message: "Please enter a valid withdrawal amount.",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    /*==========================================================
    CALCULATE PENDING WITHDRAWALS
    ==========================================================*/

    const pending = await Withdrawal.aggregate([
      {
        $match: {
          user: user._id,
          status: "Pending",
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$amount",
          },
        },
      },
    ]);

    const pendingAmount = pending.length ? pending[0].total : 0;

    const availableBalance = user.balance - pendingAmount;

    if (withdrawalAmount > availableBalance) {
      return res.status(400).json({
        message: `Insufficient available balance. Available: $${availableBalance.toFixed(2)}`,
      });
    }

    /*==========================================================
    CREATE WITHDRAWAL
    ==========================================================*/

    const withdrawal = await Withdrawal.create({
      user: req.user.id,
      amount: withdrawalAmount,
      coin,
      walletAddress,
      status: "Pending",
      progress: 0,
      lastProgressUpdate: new Date(),
    });

    /*==========================================================
CREATE TRANSACTION
==========================================================*/

    await createTransaction({
      user: req.user.id,

      type: "Withdrawal",

      amount: withdrawalAmount,

      status: "Pending",

      description: `Withdrawal request to ${walletAddress}.`,

      wallet: walletAddress,

      coin,
    });

    /*==========================================================
CREATE NOTIFICATION
==========================================================*/

await createNotification({

    user: req.user.id,

    title: "Withdrawal Submitted",

    message: `Your ${coin.toUpperCase()} withdrawal request of $${withdrawalAmount.toLocaleString()} has been submitted and is awaiting admin approval.`,

    type: "info"

});

  

    res.status(201).json({
      message: "Withdrawal request submitted successfully.",
      withdrawal,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

exports.getWithdrawals = async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find({
      user: req.user.id,
    }).sort({
      createdAt: -1,
    });

    res.json({
      withdrawals,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
