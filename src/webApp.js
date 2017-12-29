var {BlockChain}=require('./Blockchain.js');
var {Block}=require('./contracts/Block.js');

var express=require('express'), //require for creating a web server
http=require('http'),
bodyParser=require('body-parser');

var app=express();
var blockChain= new BlockChain();

//configuring application
app.set('port',process.env.PORT||8081);
app.set('host',process.env.ADDRESS||"127.0.0.1");
app.use(bodyParser.json());

app.post('/transaction/new',function(req,res){
    if(req.body==null){
       return res.sendStatus(400);
    }
blockChain.addTransaction(req.body);
res.send("Transaction added successfully");
});

app.get('/mine',function(req,res){
  var response={
      message: "Block added successfully",
      block:blockChain.addBlock()
  };
res.send(JSON.stringify(response));
});

//run the webserver
http.createServer(app).listen(app.get('port'),app.get('host'),function(){
console.log("Server created for Blockchain POC at port: %j, address: %j",app.get('port'),app.get('host'));
});