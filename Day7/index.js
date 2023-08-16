/* 1.Take File from the user check if the file is present or not.
the file should be of only .txt form .check that file size should 
not exceed 10 KB */

const http=require("http");
const fs=require("fs");
const formidable=require("formidable");
const server=http.createServer((req,res)=>{
    res.writeHead(200,{'Content-Type': 'text/html'});
    if(req.url=="/fileupload"){
        var form= new formidable.IncomingForm();
        form.parse(req,(err,fields,files)=>{
        try{
            var oldpath=files.filetoupload[0].filepath;
            var newpath=__dirname+'/'+ files.filetoupload[0].originalFilename;
            if(files.filetoupload[0].originalFilename.endsWith(".txt") && files.filetoupload[0].size<10240){
                fs.rename(oldpath,newpath,(err)=>{
                if(err) throw err;
                    res.write('file will be uploaded')
                    res.end();
                })  
            }else{
                res.write('invalid format')
                res.end();
            }
        }catch {
            res.write("no file chosen")
            res.end();
        }       
        })          
        
    }else{
        res.write("<form action='fileupload' method='post' enctype='multipart/form-data'>")
        res.write("<input type='file' name='filetoupload'><br>")
        res.write("<input type='submit' value='Submit'>")
        res.write("</form>")
        res.end();
    }
   
})


server.listen(8000,()=>{
    console.log("Server listening on")
})