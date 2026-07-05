const Wallet = require("../models/Wallet");

/*==========================================================
GET WALLETS
==========================================================*/

exports.getWallets = async (req, res) => {
  try {
    let wallets = await Wallet.findOne();

    if (!wallets) {
      wallets = await Wallet.create({});
    }

    res.json({
      wallets,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Unable to load wallets.",
    });
  }
};

/*==========================================================
SAVE WALLETS
==========================================================*/

exports.saveWallets = async (req, res) => {
  try {
    const {
      BTC,

      ETH,

      USDT_TRC20,

      USDT_ERC20,
    } = req.body;

    let wallets = await Wallet.findOne();

    if (!wallets) {
      wallets = new Wallet();
    }

    wallets.BTC = BTC;

    wallets.ETH = ETH;

    wallets.USDT_TRC20 = USDT_TRC20;

    wallets.USDT_ERC20 = USDT_ERC20;

    await wallets.save();

    res.json({
      message: "Wallets updated successfully.",

      wallets,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error.",
    });
  }
};
