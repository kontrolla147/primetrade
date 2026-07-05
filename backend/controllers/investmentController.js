const Investment = require("../models/Investment");
const createTransaction = require("../utils/createTransaction");
const InvestmentPlan = require("../models/InvestmentPlan");
const createNotification = require("../utils/createNotification");

const User = require("../models/User");

exports.createInvestment = async (req, res) => {
  try {
    const { planId, amount } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    const plan = await InvestmentPlan.findById(planId);

    if (!plan) {
      return res.status(404).json({
        message: "Investment plan not found.",
      });
    }

    if (plan.status !== "Active") {
      return res.status(400).json({
        message: "This investment plan is unavailable.",
      });
    }

    if (amount < plan.minimum) {
      return res.status(400).json({
        message: `Minimum investment is $${plan.minimum}.`,
      });
    }

    if (amount > plan.maximum) {
      return res.status(400).json({
        message: `Maximum investment is $${plan.maximum}.`,
      });
    }

    if (amount > user.balance) {
      return res.status(400).json({
        message: "Insufficient balance.",
      });
    }

    /*==========================================================

    DEDUCT USER BALANCE

    ==========================================================*/

    user.balance -= amount;

    await user.save();

    /*==========================================================

    CALCULATIONS

    ==========================================================*/

    const expectedProfit = (amount * plan.roi) / 100;

    const totalReturn = amount + expectedProfit;

    const startDate = new Date();

    const endDate = new Date();

    endDate.setDate(endDate.getDate() + plan.duration);

    /*==========================================================

    CREATE INVESTMENT

    ==========================================================*/

    const investment = await Investment.create({
      user: user._id,

      plan: plan._id,

      planName: plan.name,

      amount,

      roi: plan.roi,

      expectedProfit,

      totalReturn,

      duration: plan.duration,

      startDate,

      endDate,

      progress: 0,

      status: "Running",
    });

    /*==========================================================
CREATE TRANSACTION
==========================================================*/

    await createTransaction({
      user: user._id,

      type: "Investment",

      amount,

      status: "Running",

      description: `${plan.name} investment started.`,
    });

    res.status(201).json({
      message: "Investment started successfully.",

      investment,
    });

    res.status(201).json({
      message: "Investment started successfully.",

      investment,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

exports.getInvestments = async (req, res) => {

    try {

        const user = await User.findById(req.user.id);

        const investments = await Investment.find({

            user: req.user.id

        }).sort({

            createdAt: -1

        });

        const now = new Date();

        for (const investment of investments) {

            if (investment.status === "Running") {

                const start = new Date(investment.startDate).getTime();

                const end = new Date(investment.endDate).getTime();

                const current = now.getTime();

                const totalTime = end - start;

                const elapsedTime = current - start;

                let progress = Math.floor(

                    (elapsedTime / totalTime) * 100

                );

                if (progress < 0) progress = 0;

                if (progress > 100) progress = 100;

                investment.progress = progress;

                /*==========================================================
                COMPLETE INVESTMENT
                ==========================================================*/

                if (

                    current >= end &&

                    !investment.completionProcessed

                ) {

                    investment.status = "Completed";

                    investment.progress = 100;

                    investment.completionProcessed = true;

                    user.balance += investment.totalReturn;

                    await createNotification({

                        user: user._id,

                        title: "Investment Completed",

                        message: `Your ${investment.planName} investment has matured successfully. $${Number(investment.totalReturn).toLocaleString()} has been credited to your account.`,

                        type: "success"

                    });
                    /*==========================================================
CREATE TRANSACTION
==========================================================*/

await createTransaction({

    user: user._id,

    type: "Investment Profit",

    amount: investment.totalReturn,

    status: "Credited",

    description: `${investment.planName} investment completed successfully.`

});

                }

                await investment.save();

            }

        }

        await user.save();

        res.json({

            investments

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            message: "Server Error"

        });

    }

};