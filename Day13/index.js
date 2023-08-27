/*
    For storing blogs - blogdisplay database
    For storing comment - comments database
    For storing users - store_users database - only these users can login to the website and
    put a comment
    admin module - admin can edit title content and uploads images in the database
    
*/


const express=require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const Client=new MongoClient("mongodb://0.0.0.0:27017/Ganesh")
const ObjectId=require('mongodb').ObjectId;
const multer=require('multer')
const path = require('path')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname+'/src/public', 'views'))

Client.connect().then(()=>{
    console.log("Connected to Mongo")
})
const DB=Client.db('Ganesh')
const coll=DB.collection('blogdisplay')
const coll1=DB.collection('comments')
const coll2=DB.collection('store_users');

app.use(express.static('.views/uploads'))

app.get('/:id?', (req, res) =>{
    const id=req.params.id
    if(id){
        coll2.find({email:id}).toArray().then((result)=>{
            if(result.length){
                coll.find({}).toArray().then((resp)=>{
                    coll1.find({}).toArray().then((r)=>{
                        res.render('blog',{data:resp,id:id,comments:r})
                    })                    
                })
            }
            else{
                res.send("invalid user")
            }
        })
    }
    else{
        coll.find({}).toArray().then((resp)=>{
            coll1.find({}).toArray().then((r)=>{
                res.render('blog',{data:resp,id:id,comments:r})
            })            
        })
    }
})

app.post('/login', (req, res) =>{
    res.render('blogform')
})


app.post('/comment', (req, res) =>{
    var id=req.body.id;
    coll1.insertOne({blog_name:req.body.name,id:id,comments:req.body.textarea1}).then((resp)=>{
        console.log("Comment created")
        res.redirect(`/${id}`)
    })
});

app.post('/process_login', (req, res) =>{
    var username=req.body.username
    var password=req.body.password
    coll2.find({email:username,password:password}).toArray().then((val)=>{
        if(val.length>0){
            console.log("autheticated")
            res.redirect(`/${username}`)
        }
        else{
            console.log("not")
            res.render('blogform')
        }
    }).catch((err)=>{
        console.log(err)
    })

})

app.post('/admin', (req, res)=>{
    res.render('admin')
})

app.post('/processadmin',(req, res)=>{
    console.log(req.body)
    if(req.body.username==="ganesh@gmail.com" && req.body.password==="123"){
        coll.find({}).toArray().then((response)=>{
            res.render('adminDashboard',{data:response})
        })
        
    }
    else{
        res.send("invalid credentials")
    }
})


app.post('/add', (req, res)=>{
    res.render('addpage')
})


const multerStorage=multer.diskStorage({
        destination:(req,file,cb)=>{
            cb(null,path.join(__dirname, 'src/public/views', 'uploads'))
        },
        filename:(req,file,cb)=>{
            cb(null,`${file.originalname}`)
        }
    })

const upload = multer({storage:multerStorage})

app.post('/addpage',upload.single("addfile"),(req,res)=>{
    coll.insertOne({title:req.body.title,content:req.body.content,image:req.file.path}).then(()=>{
        console.log("inserted successfully")
        res.send("file uploaded")
    })
})

app.post('/editpage',upload.single("editfile"),(req,res)=>{
    coll.updateOne({_id:new ObjectId(req.body.id)},{$set:{title:req.body.title,content:req.body.content,image:req.file.path}}).then(()=>{
        console.log("updated successfully")
        res.send("file uploaded")
    })
})


app.post('/edit', (req, res)=>{
    res.render('editpage',{data:req.body})
})


app.post('/delete', (req, res)=>{
    coll.deleteOne({_id:new ObjectId(req.body.id1)}).then(()=>{
        coll1.deleteMany({blog_name:(req.body.index)}).then(()=>{
            console.log("comments and blogs are deleted successfully")
            coll.find({}).toArray().then((response)=>{
                res.render('adminDashboard',{data:response})
            })
        })
    })
})

app.listen(8000,(req, res) =>{
    console.log("listening on")
})