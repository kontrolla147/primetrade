"use strict";

const Transaction = require("../models/Transaction");

/*==========================================================
GET ALL TRANSACTIONS
==========================================================*/

/*==========================================================
GET ALL TRANSACTIONS
==========================================================*/

exports.getTransactions = async (req, res) => {

    try {

        const page = Number(req.query.page) || 1;

        const limit = Number(req.query.limit) || 10;

        const skip = (page - 1) * limit;

        const search = req.query.search?.trim() || "";

        const type = req.query.type || "all";

        const status = req.query.status || "all";

        /*==========================================================
        BUILD FILTER
        ==========================================================*/

        const match = {};

        if (type !== "all") {

            match.type = type;

        }

        if (status !== "all") {

            match.status = status;

        }

        /*==========================================================
        SEARCH
        ==========================================================*/

        const searchMatch = search
            ? {

                  $or: [

                      {

                          reference: {

                              $regex: search,

                              $options: "i"

                          }

                      },

                      {

                          type: {

                              $regex: search,

                              $options: "i"

                          }

                      },

                      {

                          "user.username": {

                              $regex: search,

                              $options: "i"

                          }

                      },

                      {

                          "user.fullName": {

                              $regex: search,

                              $options: "i"

                          }

                      },

                      {

                          "user.email": {

                              $regex: search,

                              $options: "i"

                          }

                      }

                  ]

              }
            : {};

        /*==========================================================
        LOAD TRANSACTIONS
        ==========================================================*/

        const transactions = await Transaction.aggregate([

            {

                $lookup: {

                    from: "users",

                    localField: "user",

                    foreignField: "_id",

                    as: "user"

                }

            },

            {

                $unwind: "$user"

            },

            {

                $match: match

            },

            ...(search ? [{ $match: searchMatch }] : []),

            {

                $sort: {

                    createdAt: -1

                }

            },

            {

                $skip: skip

            },

            {

                $limit: limit

            }

        ]);

        /*==========================================================
        TOTAL COUNT
        ==========================================================*/

        const totalResult = await Transaction.aggregate([

            {

                $lookup: {

                    from: "users",

                    localField: "user",

                    foreignField: "_id",

                    as: "user"

                }

            },

            {

                $unwind: "$user"

            },

            {

                $match: match

            },

            ...(search ? [{ $match: searchMatch }] : []),

            {

                $count: "total"

            }

        ]);

        const totalTransactions = totalResult.length

            ? totalResult[0].total

            : 0;

        /*==========================================================
        STATISTICS
        ==========================================================*/

        const [

            pending,

            approved,

            rejected,

            running,

            completed,

            credited

        ] = await Promise.all([

            Transaction.countDocuments({

                status: "Pending"

            }),

            Transaction.countDocuments({

                status: "Approved"

            }),

            Transaction.countDocuments({

                status: "Rejected"

            }),

            Transaction.countDocuments({

                status: "Running"

            }),

            Transaction.countDocuments({

                status: "Completed"

            }),

            Transaction.countDocuments({

                status: "Credited"

            })

        ]);

        res.json({

            transactions,

            currentPage: page,

            totalPages: Math.ceil(totalTransactions / limit),

            totalTransactions,

            pending,

            approved,

            rejected,

            running,

            completed,

            credited

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            message: "Unable to load transactions."

        });

    }

};
/*==========================================================
GET SINGLE TRANSACTION
==========================================================*/

exports.getTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id).populate(
      "user",

      "username fullName email",
    );

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found.",
      });
    }

    res.json({
      transaction,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Unable to load transaction.",
    });
  }
};
