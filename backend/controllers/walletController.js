const Wallet = require("../models/Wallet");

const User = require("../models/User");

/*==========================================================
GET USER WALLETS
==========================================================*/

exports.getWallets = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    let wallet = await Wallet.findOne();

    if (!wallet) {
      wallet = await Wallet.create({});
    }

    res.json({
      BTC: user.customWallets.BTC || wallet.BTC,

      ETH: user.customWallets.ETH || wallet.ETH,

      USDT_TRC20: user.customWallets.USDT_TRC20 || wallet.USDT_TRC20,

      USDT_ERC20: user.customWallets.USDT_ERC20 || wallet.USDT_ERC20,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
