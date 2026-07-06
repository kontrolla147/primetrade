const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const createNotification = require("../utils/createNotification");
const User = require("../models/User");

/*==========================================================
REGISTER USER
==========================================================*/

exports.registerUser = async (req, res) => {
  try {
    const {
      fullName,
      username,
      email,
      phone,
      country,
      password,
      confirmPassword,
    } = req.body;


    
    // Validate required fields

    if (
      !fullName ||
      !username ||
      !email ||
      !phone ||
      !country ||
      !password ||
      !confirmPassword
    ) {
      return res.status(400).json({
        success: false,

        message: "All fields are required.",
      });
    }

    // Password confirmation

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,

        message: "Passwords do not match.",
      });
    }

    // Check email

    const emailExists = await User.findOne({ email });

    if (emailExists) {
      return res.status(400).json({
        success: false,

        message: "Email already exists.",
      });
    }

    // Check username

    const usernameExists = await User.findOne({ username });

    if (usernameExists) {
      return res.status(400).json({
        success: false,

        message: "Username already exists.",
      });
    }

    // Hash password

    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
// Create user

const user = await User.create({

    fullName,

    username,

    email,

    phone,

    country,

    password: hashedPassword,

});

/*==========================================================
WELCOME NOTIFICATION
==========================================================*/

await createNotification({

    user: user._id,

    title: "Welcome to PrimeTrade",

    message:
        "Welcome to PrimeTrade! Complete your KYC verification and make your first deposit to begin investing.",

    type: "success"

});

    

    return res.status(201).json({
      success: true,

      message: "Registration successful.",

      user: {
        id: user._id,

        fullName: user.fullName,

        username: user.username,

        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,

      message: "Internal Server Error.",
    });
  }
};

/*==========================================================
LOGIN USER
==========================================================*/

exports.loginUser = async (req, res) => {
  try {
    const {
      email,

      password,
    } = req.body;

    // Validate

    if (!email || !password) {
      return res.status(400).json({
        success: false,

        message: "Email and password are required.",
      });
    }

    // Find user

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(401).json({
        success: false,

        message: "Invalid email or password.",
      });
    }

    // Suspended account

    if (user.accountStatus === "suspended") {
      return res.status(403).json({
        success: false,

        message: "Your account has been suspended.",
      });
    }

    // Compare password

    const isMatch = await bcrypt.compare(
      password,

      user.password,
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,

        message: "Invalid email or password.",
      });
    }

    // Generate JWT

    const token = jwt.sign(
      {
        id: user._id,

        role: user.role,
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "7d",
      },
    );

    // Save JWT in HTTP-only cookie

    res.cookie("token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});


    // Redirect based on role

    const redirect =
      user.role === "admin" ? "/admin/dashboard.html" : "/dashboard/dashboard.html";

    return res.status(200).json({
      success: true,

      message: "Login successful.",

      redirect,

      user: {
        id: user._id,

        fullName: user.fullName,

        username: user.username,

        email: user.email,

        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,

      message: "Internal Server Error.",
    });
  }
};

/*==========================================================
LOGOUT USER
==========================================================*/

exports.logoutUser = (req, res) => {
res.clearCookie("token", {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
});

  return res.status(200).json({
    success: true,

    message: "Logged out successfully.",
  });
};


/*==========================================================
GET CURRENT USER
==========================================================*/

exports.getCurrentUser = async (req, res) => {

    try{

        const user = await User.findById(req.user.id).select("-password");

        if(!user){

            return res.status(404).json({

                success:false,

                message:"User not found."

            });

        }

        return res.status(200).json({

            success:true,

            user

        });

    }

    catch(error){

        console.error(error);

        return res.status(500).json({

            success:false,

            message:"Server Error"

        });

    }

};