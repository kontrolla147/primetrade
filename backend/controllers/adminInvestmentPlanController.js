"use strict";

const InvestmentPlan = require("../models/InvestmentPlan");

/*==========================================================
GET ALL PLANS
==========================================================*/

exports.getPlans = async (req, res) => {
  try {
    const plans = await InvestmentPlan.find()

      .sort({
        createdAt: -1,
      });

    res.json({
      plans,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Unable to load investment plans.",
    });
  }
};

/*==========================================================
CREATE PLAN
==========================================================*/

exports.createPlan = async (req, res) => {
  try {
    const {
      name,

      roi,

      duration,

      minimum,

      maximum,

      badge,

      description,

      status,
    } = req.body;

    if (!name || !roi || !duration || !minimum || !maximum) {
      return res.status(400).json({
        message: "Please complete all required fields.",
      });
    }

    const exists = await InvestmentPlan.findOne({
      name: name.trim(),
    });

    if (exists) {
      return res.status(400).json({
        message: "An investment plan with this name already exists.",
      });
    }

    const plan = await InvestmentPlan.create({
      name,

      roi,

      duration,

      minimum,

      maximum,

      badge,

      description,

      status,
    });

    res.status(201).json({
      message: "Investment plan created successfully.",

      plan,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Unable to create investment plan.",
    });
  }
};

/*==========================================================
UPDATE PLAN
==========================================================*/

exports.updatePlan = async (req, res) => {
  try {
    const plan = await InvestmentPlan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({
        message: "Investment plan not found.",
      });
    }

    Object.assign(
      plan,

      req.body,
    );

    await plan.save();

    res.json({
      message: "Investment plan updated successfully.",

      plan,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Unable to update investment plan.",
    });
  }
};

/*==========================================================
HIDE / ACTIVATE PLAN
==========================================================*/

exports.togglePlan = async (req, res) => {

    try{

        const plan = await InvestmentPlan.findById(

            req.params.id

        );

        if(!plan){

            return res.status(404).json({

                message:"Investment plan not found."

            });

        }

        plan.status =

            plan.status === "Active"

            ?

            "Hidden"

            :

            "Active";

        await plan.save();

        res.json({

            message:`Investment plan ${plan.status.toLowerCase()} successfully.`,

            plan

        });

    }

    catch(error){

        console.error(error);

        res.status(500).json({

            message:"Unable to update investment plan."

        });

    }

};

/*==========================================================
DELETE PLAN
==========================================================*/

exports.deletePlan = async (req, res) => {

    try{

        const plan = await InvestmentPlan.findById(

            req.params.id

        );

        if(!plan){

            return res.status(404).json({

                message:"Investment plan not found."

            });

        }

        await plan.deleteOne();

        res.json({

            message:"Investment plan deleted successfully."

        });

    }

    catch(error){

        console.error(error);

        res.status(500).json({

            message:"Unable to delete investment plan."

        });

    }

};

/*==========================================================
USER - GET ACTIVE PLANS
==========================================================*/

exports.getActivePlans = async (req, res) => {

    try{

        const plans = await InvestmentPlan.find({

            status:"Active"

        }).sort({

            minimum:1

        });

        res.json({

            plans

        });

    }

    catch(error){

        console.error(error);

        res.status(500).json({

            message:"Unable to load investment plans."

        });

    }

};

