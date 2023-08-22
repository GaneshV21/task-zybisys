//TODO LIST

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const path = require('path')
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId



const Client = new MongoClient("mongodb://0.0.0.0:27017/Ganesh")
Client.connect().then(()=>{
    console.log("connected");
})

const db=Client.db("Ganesh")
const coll=db.collection("Todo")

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended:true }))


app.set('view engine', 'ejs')
app.set('views', path.join(__dirname+'/src/public/', 'views'))

app.get('/', (req, resp) => {
    Client.connect().then(()=>{
        coll.find({}).toArray().then((res)=>{
            resp.render('basic',{arr:res})
        })
    });
})
app.post('/', (req, res) => {
        Client.connect().then(()=>{
            coll.insertOne({todo:req.body.todo}).then(()=>{
                console.log("Inserted");
                res.redirect('/');
            })
        });
    
    
})
app.get('/delete/:id', (req, res) => {
    coll.deleteOne({_id:new ObjectId(req.params.id)}).then(()=>{
        res.redirect('/');
    })
})


app.get('/edit/:id',(req, res) => {
        var id = req.params.id
        var o_id= new ObjectId(id)
        coll.find({_id:o_id}).toArray().then((data)=>{
            res.render("edit",{data:data})
        }).catch((err)=>{
            console.log(err)
        })
        
    });

app.post('/edit',(req,res)=>{
    coll.updateOne({_id:new ObjectId(req.body._id)},{$set:{todo:req.body.todo}}).then(()=>{
        res.redirect('/')
            }).catch((err)=>{
                console.log(err)
            })
            
        })

app.listen(8000,() => {
    console.log("server listening");
})