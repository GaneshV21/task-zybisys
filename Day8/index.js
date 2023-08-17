const express= require('express');
const app = express();

app.set('view engine', 'ejs');
app.set('views',__dirname)

app.get('/', function(req, res){
    var arrObj=[{"name":"Ganesh","salary":20000},{"name":"Karthik","salary":40000},{"name":"Sekar","salary":25000},
    {"name":"Guna","salary":30000},{"name":"Kowshik","salary":35000}]
    var arr=[1,2,3,4,5,6,7,8,9,0]
    var date=new Date();
    res.render('demo',{arrObj:arrObj,arr:arr,date:date})
})

app.listen(8000,() => {
    console.log('listening on');
})