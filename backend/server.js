require("dotenv").config();
require("./jobs/withdrawalProgressJob");

const path = require("path");
const express = require("express");
const cors = require("cors");
const transactionRoutes = require("./routes/transactionRoutes");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const withdrawRoutes = require("./routes/withdrawRoutes");
const app = express();
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

connectDB();
app.use(cookieParser());
app.use(cors());

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/withdrawals", withdrawRoutes);
app.use(express.urlencoded({ extended: true }));
app.use("/api/transactions", transactionRoutes);
app.use("/api/investments", investmentRoutes);
app.use("/api/wallets", walletRoutes);
app.use("/api/kyc", kycRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminAuthRoutes);
app.use("/api/admin", manageDashboardRoutes);
app.use("/api/admin/manage-users", manageUsersRoutes);
app.use("/api/admin/deposits", manageDepositsRoutes);
app.use("/api/deposits", depositRoutes);
app.use("/api/admin/wallets", manageWalletRoutes);
app.use("/api/admin/kyc", manageKycRoutes);
app.use("/api/admin/withdrawals", manageWithdrawalRoutes);
app.use("/api/admin/investment-plans", adminInvestmentPlanRoutes);
app.use("/api/investment-plans", investmentPlanRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin/activities", activityRoutes);
app.use("/api/admin/transactions", adminTransactionRoutes);



app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
