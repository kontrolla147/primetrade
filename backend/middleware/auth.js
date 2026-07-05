const jwt = require("jsonwebtoken");

const User = require("../models/User");

/*==========================================================
AUTH MIDDLEWARE
==========================================================*/

const auth = async (req, res, next) => {

    try {

        const token = req.cookies.token;

        if (!token) {

            return res.status(401).json({

                success: false,

                message: "Access denied. Please login."

            });

        }

        const decoded = jwt.verify(

            token,

            process.env.JWT_SECRET

        );

        const user = await User.findById(decoded.id).select("-password");

        if (!user) {

            return res.status(401).json({

                success: false,

                message: "User not found."

            });

        }

        req.user = user;

        next();

    }

    catch (error) {

        return res.status(401).json({

            success: false,

            message: "Invalid or expired session."

        });

    }

};
module.exports = (req, res, next) => {

    try{

        const token = req.cookies.token;

        if(!token){

            return res.status(401).json({

                success:false,

                message:"Unauthorized"

            });

        }

        const decoded = jwt.verify(

            token,

            process.env.JWT_SECRET

        );

        req.user = decoded;

        next();

    }

    catch(error){

        return res.status(401).json({

            success:false,

            message:"Invalid Token"

        });

    }

};


module.exports = auth;