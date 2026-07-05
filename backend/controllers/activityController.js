const Activity = require("../models/Activity");

/*==========================================================
GET ACTIVITIES
==========================================================*/

exports.getActivities = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;

    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const filter = {};

    /*==========================================================
        SEARCH
        ==========================================================*/

    if (req.query.search) {
      filter.$or = [
        {
          action: {
            $regex: req.query.search,

            $options: "i",
          },
        },

        {
          target: {
            $regex: req.query.search,

            $options: "i",
          },
        },

        {
          description: {
            $regex: req.query.search,

            $options: "i",
          },
        },
      ];
    }

    /*==========================================================
        LOAD ACTIVITIES
        ==========================================================*/

    const activities = await Activity.find(filter)

      .populate(
        "admin",

        "fullName username",
      )

      .sort({
        createdAt: -1,
      })

      .skip(skip)

      .limit(limit);

    const total = await Activity.countDocuments(filter);

    res.json({
      activities,

      currentPage: page,

      totalPages: Math.ceil(total / limit),

      totalActivities: total,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
