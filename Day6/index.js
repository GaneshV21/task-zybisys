const express = require('express');
const app = express();

const MongoClient = require('mongodb').MongoClient;
const url="mongodb://0.0.0.0:27017/Ganesh"
const Client =new MongoClient(url);
const ObjectId = require('mongodb').ObjectId;
const DB=Client.db("Ganesh");
const coll=DB.collection("crud")


//1.question - diff routes in express to perform CRUD

app.get('/1/:name/:age', (req,res) => {
    let name = req.params.name
    let age = req.params.age
    Client.connect(url).then(()=>{ 
        var obj={name:name,age:age}
        coll.insertOne(obj).then(()=>{
            console.log("Inserted")
        })
    })
    res.send("Data Successfully Inserted")
})

app.get('/2/:value', (req,res) => {
    let value = req.params.value
    let obj={}
    if(parseInt(value)){
        obj={"age":value}   
    }else{
        obj={"name":value}
    }
    Client.connect(url).then(()=>{
        coll.find(obj).toArray().then((res)=>{
            console.log(res)
        })
    })
    res.send("Data reading successfully")
    
})

app.get('/3/:value', (req,res) => {
    let value = req.params.value
    let obj={}
    if(parseInt(value)){
        obj={"age":value}   
    }else{
        obj={"name":value}
    }
    Client.connect(url).then(()=>{
        coll.deleteMany(obj).then((res)=>{
            console.log(res)
        })
    })
    res.send("Data deleted successfully")
    

})

app.get('/4/:name/:age',(req,res,next) =>{
    let name = req.params.name
    let age=req.params.age
    let obj={name:name}
    Client.connect(url).then(()=>{
        coll.updateMany(obj,{$set:{"name":name,"age":age}}).then((res)=>{
            console.log(res)
        })
    })
    res.send("Data updated successfully")
})


//2.question - fetch data from collection and write it to a text file

const fs=require("fs");
coll.find({}).toArray().then((res)=>{
    fs.writeFile("data.txt",JSON.stringify(res),(err,res)=>{
    if(err){
        console.log(err)
    }
    else{
        console.log("file created successfully")
    }
})
})



app.listen(3000,() => {
    console.log('listening')
})


//mongo queries
//1.db.hotel.aggregate([{$group:{_id:"$name",max:{$max:{$max:"$grades.score"}}}}])
//2.db.hotel.aggregate([{$group:{_id:"$name",min:{$min:{min:{$min:"$grades.score"}}}}}])
//3.db.hotel.aggregate({$group:{_id:"$borough",sum:{$sum:1}}})
//4.db.hotel.aggregate({$match:{"grades.grade":"A"}},{$group:{_id:"$cuisine",sum:{$sum:1}}})


