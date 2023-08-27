const Notes = require("../models/schema");

exports.find=(req,res)=>{
    Notes.find({_id:req.params.id}).then((resp)=>{
        res.send({status:200, msg:resp})
    }).catch((err)=>{
        res.send({status:400,msg:err})
    })
}