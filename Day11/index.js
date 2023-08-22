const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const sessions= require('express-session');
const cookieParser = require('cookie-parser');
const MongoClient = require('mongodb').MongoClient;
const Client = new MongoClient("mongodb://0.0.0.0:27017/Ganesh")
const path = require('path');
const multer = require('multer');
app.set('view engine', 'ejs');
app.set("views",path.join(__dirname+'/src/public', 'views'));
app.use(cookieParser())
app.use(sessions({
    secret:"thisismysecretkey",
    saveUninitialized: true,
    resave:false
}))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine','ejs')
app.set('views',path.join(__dirname+'/src/public/','views'))




// 1.count the number of times a user visits a webpage.do this using session 

var session;
var count=0;

app.get('/',(req,res)=>{
    session=req.session
    session.userid=count++;
    res.send("count = "+ count)
})


/* 2. check the type of file. if the file type is image then upload the file in images folder otherwise
 upload it in files folder. your image file type should be only png. all the file in mongodb.*/


const multerStorage=multer.diskStorage({
    destination:(req,file,cb)=>{
        if(file.originalname.endsWith('.png') ){
            cb(null,"images")
        }
        else if(file.originalname.endsWith('.jpg')){
            cb(new Error("file format is not supported"),false)
        }
        else if(file.originalname.endsWith('.jpeg')){
            cb(new Error("file format is not supported"),false)
        }
        else{
            cb(null,"file")
        }
        
    },
    filename:(req,file,cb)=>{
        cb(null,`${Date.now()}.${file.originalname}`)
    }
})



const upload = multer({storage:multerStorage})

app.get('/multer',(req,res)=>{
    res.render('multerr')
})

Client.connect().then(()=>{
    console.log("connected");
})

const DB=Client.db("Ganesh");
const coll=DB.collection("crud")
app.post('/upload',upload.single("myfile"),(req,res)=>{
    console.log(req.file)
        coll.insertOne({files:req.file}).then(()=>{
            console.log("inserted successfully")
        })
    res.send("file uploaded")
})

app.listen(8000,() => {
    console.log('listening on')
})