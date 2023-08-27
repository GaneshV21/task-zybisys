const mongoose=require('mongoose');

const Schema = mongoose.Schema({
    title:String,
    content:String
},{
    timestamps:true
})

const database=mongoose.model('Note',Schema);
module.exports=database;