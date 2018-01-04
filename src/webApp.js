let {BlockChain}=require('./Blockchain.js');
let {Block}=require('./contracts/Block.js');

const express=require('express'), //require for creating a web server
http=require('http'),
bodyParser=require('body-parser');

let app=express();
let blockChain= new BlockChain();

//configuring application
app.set('port',process.env.PORT||8082);
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
  let response={
      message: "Block added successfully",
      block:blockChain.addBlock()
  };
res.send(JSON.stringify(response));
});

//get the chain of application
app.get('/chain',function(req,res){
    let response={
        "length":blockChain.chain.length,
        "chain":blockChain.chain
    };
    res.send(JSON.stringify(response));
});

//adds new node to server
app.post('/node/add',function(req,res){
    blockChain.addNodes(req.body.nodes);
    let response={
        "success":true,
        "nodes":blockChain.nodes
    };
    res.send(JSON.stringify(response));
});

//consensus to resolve conflicts of chain
app.get('/conflicts/resolve',function(req,res){
    blockChain.resolveconflict(function(isChainModified){
        let response={
        "status": isChainModified?"Chain Modified":"Chain Authtorative",
        "chain":blockChain.chain
        };
        res.send(JSON.stringify(response));
    });
});

//run the webserver
http.createServer(app).listen(app.get('port'),app.get('host'),function(){
console.log("Server created for Blockchain POC at port: %j, address: %j",app.get('port'),app.get('host'));
});