const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema({

    BTC:{

        type:String,

        default:""

    },

    ETH:{

        type:String,

        default:""

    },

    USDT_TRC20:{

        type:String,

        default:""

    },

    USDT_ERC20:{

        type:String,

        default:""

    }

},{
    timestamps:true
});

module.exports = mongoose.model("Wallet", walletSchema);