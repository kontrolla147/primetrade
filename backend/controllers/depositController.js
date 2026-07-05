const Deposit = require("../models/Deposit");
const createTransaction = require("../utils/createTransaction");
const Wallet = require("../models/Wallet");
const createNotification = require("../utils/createNotification");

/*==========================================================
GET USER DEPOSITS
==========================================================*/

exports.getDeposits = async (req, res) => {
  try {
    const deposits = await Deposit.find({
      user: req.user.id,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,

      deposits,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,

      message: "Server Error",
    });
  }
};

/*==========================================================
CREATE DEPOSIT
==========================================================*/

exports.createDeposit = async (req, res) => {
  try {
    const {
      amount,

      coin,
    } = req.body;

    if (!amount || !coin) {
      return res.status(400).json({
        success: false,

        message: "Please complete the form.",
      });
    }

    const wallets = await Wallet.findOne();

    if (!wallets) {
      return res.status(404).json({
        success: false,

        message: "Wallets have not been configured.",
      });
    }

  const deposit = await Deposit.create({

    user: req.user.id,

    amount,

    coin,

    walletAddress: wallets[coin],

});

await createNotification({

    user: req.user.id,

    title: "Deposit Submitted",

    message: `Your ${coin.toUpperCase()} deposit request of $${Number(amount).toLocaleString()} has been submitted and is awaiting admin approval.`,

    type: "info"

});

    /*==========================================================
CREATE TRANSACTION
==========================================================*/

    await createTransaction({
      user: req.user.id,

      type: "Deposit",

      amount,

      status: "Pending",

      description: `Deposit request for ${coin}.`,

      wallet: wallets[coin],

      coin,
    });

    res.status(201).json({
      success: true,

      message: "Deposit request submitted successfully.",

      deposit,
    });
    res.status(201).json({
      success: true,

      message: "Deposit request submitted successfully.",

      deposit,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,

      message: "Server Error",
    });
  }
};

/*==========================================================
GET WALLET
==========================================================*/
exports.getWallet = async (req, res) => {
  try {
    const { coin } = req.params;

    const wallets = await Wallet.findOne();

    if (!wallets) {
      return res.status(404).json({
        success: false,

        message: "Wallets not configured.",
      });
    }

    if (!wallets[coin]) {
      return res.status(404).json({
        success: false,

        message: "Wallet not found.",
      });
    }

    res.json({
      success: true,

      wallet: wallets[coin],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,

      message: "Server Error",
    });
  }
};
