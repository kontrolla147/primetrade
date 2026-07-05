const User = require("../models/User");

/*==========================================================
GET ALL USERS
==========================================================*/

exports.getUsers = async (req, res) => {

    try {

        const users = await User.find()

            .select(

                "fullName username email accountStatus createdAt"

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
GET SINGLE USER
==========================================================*/

exports.getUser = async (req, res) => {

    try {

        const user = await User.findById(

            req.params.id

        );

        if (!user) {

            return res.status(404).json({

                message: "User not found."

            });

        }

        res.json({

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
UPDATE USER PROFILE
==========================================================*/

exports.updateUser = async (req, res) => {

    try {

        const {

            fullName,

            username,

            email,

            phone,

            country

        } = req.body;

        const user = await User.findById(

            req.params.id

        );

        if (!user) {

            return res.status(404).json({

                message: "User not found."

            });

        }

        /*==========================================================
        CHECK USERNAME
        ==========================================================*/

        if (

            username &&

            username !== user.username

        ) {

            const existingUsername =

                await User.findOne({

                    username

                });

            if (existingUsername) {

                return res.status(400).json({

                    message:

                        "Username already exists."

                });

            }

        }

        /*==========================================================
        CHECK EMAIL
        ==========================================================*/

        if (

            email &&

            email !== user.email

        ) {

            const existingEmail =

                await User.findOne({

                    email

                });

            if (existingEmail) {

                return res.status(400).json({

                    message:

                        "Email already exists."

                });

            }

        }

        /*==========================================================
        UPDATE
        ==========================================================*/

        user.fullName =

            fullName?.trim() ||

            user.fullName;

        user.username =

            username?.trim() ||

            user.username;

        user.email =

            email?.trim().toLowerCase() ||

            user.email;

        user.phone =

            phone?.trim() ||

            user.phone;

        user.country =

            country?.trim() ||

            user.country;

        await user.save();

        res.json({

            message:

                "User updated successfully.",

            user

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            message:

                "Unable to update user."

        });

    }

};



/*==========================================================
UPDATE CUSTOM WALLETS
==========================================================*/

exports.updateWallets = async (req, res) => {

    try {

        const {

            BTC,

            ETH,

            USDT_TRC20,

            USDT_ERC20

        } = req.body;

        const user = await User.findById(

            req.params.id

        );

        if (!user) {

            return res.status(404).json({

                message: "User not found."

            });

        }

        user.customWallets.BTC =

            BTC?.trim() ||

            "";

        user.customWallets.ETH =

            ETH?.trim() ||

            "";

        user.customWallets.USDT_TRC20 =

            USDT_TRC20?.trim() ||

            "";

        user.customWallets.USDT_ERC20 =

            USDT_ERC20?.trim() ||

            "";

        await user.save();

        res.json({

            message: "Wallets updated successfully.",

            user

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            message: "Unable to update wallets."

        });

    }

};

/*==========================================================
SUSPEND / ACTIVATE USER
==========================================================*/

exports.toggleStatus = async (req, res) => {

    try {

        const user = await User.findById(

            req.params.id

        );

        if (!user) {

            return res.status(404).json({

                message: "User not found."

            });

        }

        user.accountStatus =

            user.accountStatus === "active"

                ? "suspended"

                : "active";

        await user.save();

        res.json({

            message:

                `User ${user.accountStatus}.`,

            user

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            message: "Unable to update status."

        });

    }

};

/*==========================================================
APPROVE KYC
==========================================================*/

exports.approveKyc = async (req, res) => {

    try {

        const user = await User.findById(

            req.params.id

        );

        if (!user) {

            return res.status(404).json({

                message: "User not found."

            });

        }

        user.kycStatus = "Verified";

        user.isVerified = true;

        await user.save();

        res.json({

            message: "KYC approved.",

            user

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            message: "Unable to approve KYC."

        });

    }

};

/*==========================================================
REJECT KYC
==========================================================*/

exports.rejectKyc = async (req, res) => {

    try {

        const user = await User.findById(

            req.params.id

        );

        if (!user) {

            return res.status(404).json({

                message: "User not found."

            });

        }

        user.kycStatus = "Rejected";

        user.isVerified = false;

        await user.save();

        res.json({

            message: "KYC rejected.",

            user

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            message: "Unable to reject KYC."

        });

    }

};


const jwt = require("jsonwebtoken");

/*==========================================================
DELETE USER
==========================================================*/

exports.deleteUser = async (req, res) => {

    try {

        const user = await User.findById(req.params.id);

        if (!user) {

            return res.status(404).json({

                message: "User not found."

            });

        }

        if (user.role === "admin") {

            return res.status(403).json({

                message: "Administrator accounts cannot be deleted."

            });

        }

        await User.findByIdAndDelete(user._id);

        res.json({

            message: "User deleted successfully."

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            message: "Unable to delete user."

        });

    }

};

/*==========================================================
LOGIN AS USER
==========================================================*/

exports.loginAsUser = async (req, res) => {

    try {

        const user = await User.findById(req.params.id);

        if (!user) {

            return res.status(404).json({

                message: "User not found."

            });

        }

        if (user.accountStatus === "suspended") {

            return res.status(403).json({

                message: "Suspended users cannot be accessed."

            });

        }

        const token = jwt.sign(

            {

                id: user._id,

                role: user.role,

                adminImpersonation: true

            },

            process.env.JWT_SECRET,

            {

                expiresIn: "7d"

            }

        );

        res.cookie(

            "token",

            token,

            {

                httpOnly: true,

                secure: process.env.NODE_ENV === "production",

                sameSite: "lax",

                maxAge: 7 * 24 * 60 * 60 * 1000

            }

        );

        res.json({

            message: "Logged in as user.",

            redirect: "/dashboard/dashboard.html"

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            message: "Unable to login as user."

        });

    }

};