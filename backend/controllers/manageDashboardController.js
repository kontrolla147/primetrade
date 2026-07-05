const User = require("../models/User");


/*==========================================================
GET ALL USERS
==========================================================*/

exports.getUsers = async (req, res) => {

    try {

        const users = await User.find()

            .select(

                "fullName username email balance"

            )

            .sort({

                createdAt: -1

            });

        res.json({

            users

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            message: "Unable to load users."

        });

    }

};
/*==========================================================
SEARCH USER
==========================================================*/

exports.searchUser = async (req, res) => {
  try {
    const query = req.query.q?.trim();

    if (!query) {
      return res.status(400).json({
        message: "Search value is required.",
      });
    }

    const user = await User.findOne({
      $or: [
        {
          username: {
            $regex: query,

            $options: "i",
          },
        },

        {
          email: {
            $regex: query,

            $options: "i",
          },
        },
      ],
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    res.json({
      user,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error.",
    });
  }
};



/*==========================================================
ADD PROFIT
==========================================================*/

/*==========================================================
ADD PROFIT
==========================================================*/

exports.addProfit = async (req, res) => {

    try {

        const { userId, amount } = req.body;

        if (!userId || !amount) {

            return res.status(400).json({

                message: "Amount is required."

            });

        }

        const user = await User.findById(userId);

        if (!user) {

            return res.status(404).json({

                message: "User not found."

            });

        }

        const profit = Number(amount);

        user.balance += profit;

        user.totalProfit += profit;

        await user.save();

        res.json({

            message: "Profit added successfully.",

            user

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            message: "Server error."

        });

    }

};


/*==========================================================
REMOVE PROFIT
==========================================================*/

/*==========================================================
REMOVE PROFIT
==========================================================*/

exports.removeProfit = async (req, res) => {

    try {

        const { userId, amount } = req.body;

        if (!userId || !amount) {

            return res.status(400).json({

                message: "Amount is required."

            });

        }

        const user = await User.findById(userId);

        if (!user) {

            return res.status(404).json({

                message: "User not found."

            });

        }

        const profit = Number(amount);

        if (user.balance < profit) {

            return res.status(400).json({

                message: "Insufficient balance."

            });

        }

        user.balance -= profit;

        user.totalProfit = Math.max(

            0,

            user.totalProfit - profit

        );

        await user.save();

        res.json({

            message: "Profit removed successfully.",

            user

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            message: "Server error."

        });

    }

};


/*==========================================================
ADD BONUS
==========================================================*/

exports.addBonus = async (req, res) => {

    try {

        const { userId, amount } = req.body;

        if (!userId || !amount) {

            return res.status(400).json({

                message: "Amount is required."

            });

        }

        const user = await User.findById(userId);

        if (!user) {

            return res.status(404).json({

                message: "User not found."

            });

        }

        const bonus = Number(amount);

        user.balance += bonus;

        user.bonus += bonus;

        await user.save();

        res.json({

            message: "Bonus added successfully.",

            user

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            message: "Server error."

        });

    }

};


/*==========================================================
REMOVE BONUS
==========================================================*/

exports.removeBonus = async (req, res) => {

    try {

        const { userId, amount } = req.body;

        if (!userId || !amount) {

            return res.status(400).json({

                message: "Amount is required."

            });

        }

        const user = await User.findById(userId);

        if (!user) {

            return res.status(404).json({

                message: "User not found."

            });

        }

        const bonus = Number(amount);

        if (user.balance < bonus) {

            return res.status(400).json({

                message: "Insufficient balance."

            });

        }

        user.balance -= bonus;

        user.bonus = Math.max(

            0,

            user.bonus - bonus

        );

        await user.save();

        res.json({

            message: "Bonus removed successfully.",

            user

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            message: "Server error."

        });

    }

};

/*==========================================================
ADD REFERRAL
==========================================================*/

exports.addReferral = async (req, res) => {

    try {

        const { userId, amount } = req.body;

        if (!userId || !amount) {

            return res.status(400).json({

                message: "Amount is required."

            });

        }

        const user = await User.findById(userId);

        if (!user) {

            return res.status(404).json({

                message: "User not found."

            });

        }

        const referral = Number(amount);

        user.balance += referral;

        user.referralBonus += referral;

        await user.save();

        res.json({

            message: "Referral added successfully.",

            user

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            message: "Server error."

        });

    }

};

/*==========================================================
REMOVE REFERRAL
==========================================================*/

exports.removeReferral = async (req, res) => {

    try {

        const { userId, amount } = req.body;

        if (!userId || !amount) {

            return res.status(400).json({

                message: "Amount is required."

            });

        }

        const user = await User.findById(userId);

        if (!user) {

            return res.status(404).json({

                message: "User not found."

            });

        }

        const referral = Number(amount);

        if (user.balance < referral) {

            return res.status(400).json({

                message: "Insufficient balance."

            });

        }

        user.balance -= referral;

        user.referralBonus = Math.max(

            0,

            user.referralBonus - referral

        );

        await user.save();

        res.json({

            message: "Referral removed successfully.",

            user

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            message: "Server error."

        });

    }

};
