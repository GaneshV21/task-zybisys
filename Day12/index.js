/* 1.create a login and logout application using express sessions. create user in the database with email
and password where the password should be hashed using bcrypt and the login route should check.
if the user exist in the database or not. If the user exist create their session in the database and
give 3 minutes of expiration time.If the user is inactivate for three minutes then automatically log out
the user by showing the loginpage again. */

const express= require('express')
const app= express()
const path= require('path')
const bodyParser= require('body-parser')
app.set('view engine', 'ejs')
app.set('views',path.join(__dirname+'/src/public/', 'views'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
const sessions=require('express-session')
const MongoClient= require('mongodb').MongoClient;
const Client=new MongoClient("mongodb://0.0.0.0:27017/Ganesh")
const DB=Client.db("Ganesh")
const coll1=DB.collection('store_users')
const coll2=DB.collection('session_auth')

app.use(sessions({
        secret:"thisismysecretkey",
        saveUninitialized: true,
        cookie:{maxAge:3*60000},
        resave:false
    }))   
var session;

app.get('/',(req, res) =>{
    session=req.session
    if(session.userid){
        res.send("welcome user <a href='/logout'> click to logout </a>")
    }
    else{
        coll2.deleteMany({email:session.userid}).then(()=>{
            console.log("deleted")
        })
        res.render("form")
}})

app.post('/login',(req, resp) =>{
    coll1.find({email:req.body.username, password: req.body.password}).toArray().then((res)=>{
       if(res.length==0){
            resp.send("error")
       }
       else{
        session=req.session
        session.userid=req.body.username  
        coll2.insertOne({session}).then(()=>{
            console.log("inserted")
        })
        resp.send("welcome user <a href='/logout'> click to logout </a>")       
       }
    })
})

app.get('/logout', (req, res) =>{
    req.session.destroy()
    res.redirect('/')
})

app.listen(8000,() => {
    console.log('listening on')
})