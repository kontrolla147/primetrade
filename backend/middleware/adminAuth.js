const jwt = require("jsonwebtoken");

/*==========================================================
ADMIN AUTHENTICATION
==========================================================*/

module.exports = (req, res, next) => {
  try {
    const token = req.cookies.adminToken;

    if (!token) {
      return res.status(401).json({
        message: "Administrator authentication required.",
      });
    }

    const decoded = jwt.verify(
      token,

      process.env.JWT_SECRET,
    );

    if (decoded.role !== "admin") {
      return res.status(403).json({
        message: "Access denied.",
      });
    }

    req.admin = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired administrator session.",
    });
  }
};
