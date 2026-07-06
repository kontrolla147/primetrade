require("dotenv").config();
require("./jobs/withdrawalProgressJob");

const path = require("path");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");

//==========================================================
// ROUTES
//==========================================================

const authRoutes = require("./routes/authRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const withdrawRoutes = require("./routes/withdrawRoutes");
const investmentRoutes = require("./routes/investmentRoutes");
const walletRoutes = require("./routes/walletRoutes");
const kycRoutes = require("./routes/kycRoutes");
const adminAuthRoutes = require("./routes/adminAuthRoutes");
const manageDashboardRoutes = require("./routes/manageDashboardRoutes");
const manageUsersRoutes = require("./routes/manageUsersRoutes");
const manageDepositsRoutes = require("./routes/manageDepositsRoutes");
const depositRoutes = require("./routes/depositRoutes");
const manageWalletRoutes = require("./routes/manageWalletRoutes");
const manageKycRoutes = require("./routes/manageKycRoutes");
const manageWithdrawalRoutes = require("./routes/manageWithdrawalRoutes");
const adminInvestmentPlanRoutes = require("./routes/adminInvestmentPlanRoutes");
const investmentPlanRoutes = require("./routes/investmentPlanRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const activityRoutes = require("./routes/activityRoutes");
const adminTransactionRoutes = require("./routes/adminTransactionRoutes");

//==========================================================
// APP
//==========================================================

const app = express();

//==========================================================
// DATABASE
//==========================================================

connectDB();

//==========================================================
// SECURITY
//==========================================================

app.set("trust proxy", 1);

app.disable("x-powered-by");

app.use(helmet());

app.use(cookieParser());

app.use(
  cors({
    origin: [process.env.CLIENT_URL, process.env.CLIENT_URL_WWW],
    credentials: true,
  }),
);

//==========================================================
// BODY PARSERS
//==========================================================

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

//==========================================================
// API ROUTES
//==========================================================

app.use("/api/auth", authRoutes);

app.use("/api/transactions", transactionRoutes);

app.use("/api/withdrawals", withdrawRoutes);

app.use("/api/investments", investmentRoutes);

app.use("/api/wallets", walletRoutes);

app.use("/api/kyc", kycRoutes);

app.use("/api/deposits", depositRoutes);

app.use("/api/investment-plans", investmentPlanRoutes);

app.use("/api/notifications", notificationRoutes);

//==========================================================
// ADMIN ROUTES
//==========================================================

app.use("/api/admin", adminAuthRoutes);

app.use("/api/admin", manageDashboardRoutes);

app.use("/api/admin/manage-users", manageUsersRoutes);

app.use("/api/admin/deposits", manageDepositsRoutes);

app.use("/api/admin/wallets", manageWalletRoutes);

app.use("/api/admin/kyc", manageKycRoutes);

app.use("/api/admin/withdrawals", manageWithdrawalRoutes);

app.use("/api/admin/investment-plans", adminInvestmentPlanRoutes);

app.use("/api/admin/activities", activityRoutes);

app.use("/api/admin/transactions", adminTransactionRoutes);

//==========================================================
// STATIC FILES
//==========================================================

app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

//==========================================================
// 404
//==========================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

//==========================================================
// SERVER
//==========================================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
