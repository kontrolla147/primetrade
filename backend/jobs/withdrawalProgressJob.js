"use strict";

const Withdrawal = require("../models/Withdrawal");

/*==========================================================
UPDATE PENDING WITHDRAWALS
==========================================================*/

async function updateWithdrawalProgress() {
  try {
    const withdrawals = await Withdrawal.find({
      status: "Pending",
    });

    for (const withdrawal of withdrawals) {
      if (withdrawal.progress >= 70) {
        continue;
      }

      const increase = Math.floor(Math.random() * 6) + 2;

      withdrawal.progress = Math.min(
        70,

        withdrawal.progress + increase,
      );

      withdrawal.lastProgressUpdate = new Date();

      await withdrawal.save();
    }
  } catch (error) {
    console.error(
      "Withdrawal Progress Error:",

      error,
    );
  }
}

/*==========================================================
RUN EVERY MINUTE
==========================================================*/

setInterval(
  updateWithdrawalProgress,

  60000,
);

updateWithdrawalProgress();
