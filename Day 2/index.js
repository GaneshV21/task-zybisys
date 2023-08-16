//Validation for Name and age
const express= require('express');
const app= express();
const bodyParser= require('body-parser');
app.use(bodyParser.json());
app.post('/user', function(req, res){
    let name=req.body.name
    let age=req.body.age
    let count=0,count1=0;
    for(let i=0; i<name.length; i++){
        if(parseInt(name[i])){
            count++;
        }
    }
    for(let i=0; i<age.length; i++){
        if(age[i].toUpperCase()!=age[i].toLowerCase()){
            count1++;
        }
    }
    if(name=="" || age==""){
        res.status(400).send("Failure")
    }
    else if(count===0 && count1 === 0 && parseInt(age)){
        res.status(200).send("Success")
    }  
    else{
        res.status(400).send("Failure")    
    }
})
app.listen(8080,() => {
    console.log('Server is Running');
})


