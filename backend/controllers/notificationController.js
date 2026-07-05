const Notification = require("../models/Notification");

/*==========================================================
GET LATEST DASHBOARD NOTIFICATION
==========================================================*/

exports.getNotifications = async (req, res) => {

    try {

        const twoDaysAgo = new Date();

        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

        const notification = await Notification.findOne({

            user: req.user.id,

            createdAt: {

                $gte: twoDaysAgo

            }

        })

        .sort({

            createdAt: -1

        });

        res.json({

            notifications: notification ? [notification] : []

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            message: "Server Error"

        });

    }

};