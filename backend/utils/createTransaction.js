"use strict";

const Transaction = require("../models/Transaction");

module.exports = async function createTransaction({
  user,

  type,

  amount,

  status = "Pending",

  description = "",

  wallet = "",

  coin = "",

  approvedBy = null,
}) {
  try {
    const reference =
      "PT-" +
      Date.now() +
      "-" +
      Math.random()

        .toString(36)

        .substring(2, 8)

        .toUpperCase();

    return await Transaction.create({
      user,

      type,

      amount,

      status,

      reference,

      description,

      wallet,

      coin,

      approvedBy,
    });
  } catch (error) {
    console.error(
      "Transaction Error:",

      error,
    );

    return null;
  }
};
