const Transaction = require("../models/Transaction");


exports.getTransactions = async(req,res)=>{

    try{

        const page = Number(req.query.page) || 1;

        const limit = Number(req.query.limit) || 10;

        const skip = (page-1) * limit;

        const filter = {

            user:req.user.id

        };

        if(

            req.query.type &&

            req.query.type !== "all"

        ){

            filter.type = req.query.type.charAt(0).toUpperCase() +

            req.query.type.slice(1);

        }

        if(req.query.search){

            filter.reference = {

                $regex:req.query.search,

                $options:"i"

            };

        }

        const transactions = await Transaction.find(filter)

        .sort({

            createdAt:-1

        })

        .skip(skip)

        .limit(limit);

        const total = await Transaction.countDocuments(filter);

        res.json({

            transactions,

            totalPages:Math.ceil(total/limit),

            currentPage:page

        });

    }

    catch(error){

        console.error(error);

        res.status(500).json({

            message:"Server Error"

        });

    }

};



exports.getTransaction = async(req,res)=>{

    try{

        const transaction = await Transaction.findOne({

            _id:req.params.id,

            user:req.user.id

        });

        if(!transaction){

            return res.status(404).json({

                message:"Transaction not found."

            });

        }

        res.json({

            transaction

        });

    }

    catch(error){

        console.error(error);

        res.status(500).json({

            message:"Server Error"

        });

    }

};