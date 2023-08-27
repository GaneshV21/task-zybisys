const express = require('express')
const app = express();
const bodyParser=require('body-parser')
const path = require('path');
const multer = require('multer');
const routes = require('./src/routes/route')
const mongoose= require('mongoose')
const MongoClient = require('mongodb').MongoClient;
const Client = new MongoClient("mongodb://0.0.0.0:27017/Ganesh")

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.set('view engine','ejs')
app.set('views',path.join(__dirname+'/src/','views'))

mongoose.connect('mongodb://0.0.0.0:27017/Ganesh',{useNewUrlParser:true,useUnifiedTopology:true})

const db=mongoose.connection;
db.on('open',()=>{
    console.log("mongoose connected")
})

app.use('/',routes)


const multerStorage=multer.diskStorage({
    destination:(req,file,cb)=>{
        console.log(file)
        if(file.originalname.endsWith('.pdf')){
            cb(null,"pdf")
        }

        else{
            cb(new Error("file format is not supported"),false)        
        }
        
    },
    filename:(req,file,cb)=>{
        cb(null,`${file.originalname}`)
    }
})



const upload = multer({storage:multerStorage,limits:{fileSize :1000*1024}}).single("myfile")
Client.connect().then(()=>{
    console.log("connected");
})

const DB=Client.db("Ganesh");
const coll=DB.collection("crud")
app.post('/upload',function(req,res){
    upload(req,res,function(err) {
        if(err) {
            return res.end("Error uploading file.");
        }
        coll.insertOne({files:req.file}).then(()=>{
            console.log("inserted successfully")
            res.send("file uploaded")
        })
    });});




app.listen(8000,() => {
    console.log("server listening");
})

