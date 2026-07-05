const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

/*==========================================================
ADMIN LOGIN
==========================================================*/

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    if (email !== process.env.ADMIN_EMAIL) {
      return res.status(401).json({
        message: "Invalid administrator credentials.",
      });
    }

    const validPassword = await bcrypt.compare(
      password,

      process.env.ADMIN_PASSWORD_HASH,
    );

    if (!validPassword) {
      return res.status(401).json({
        message: "Invalid administrator credentials.",
      });
    }

   const token = jwt.sign(

    {

        role: "admin"

    },

    process.env.JWT_SECRET,

    {

        expiresIn: `${process.env.ADMIN_SESSION_HOURS}h`

    }

);

res.cookie("adminToken", token, {

    httpOnly: true,

    secure: process.env.NODE_ENV === "production",

    sameSite: "Strict",

    maxAge:

        Number(process.env.ADMIN_SESSION_HOURS)

        * 60

        * 60

        * 1000

});



    res.json({
      message: "Login successful.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};



/*==========================================================
ADMIN LOGOUT
==========================================================*/

exports.logout = (req, res) => {

    res.clearCookie("adminToken", {

        httpOnly: true,

        sameSite: "Strict",

        secure: process.env.NODE_ENV === "production"

    });

    res.json({

        message: "Logged out successfully."

    });

};