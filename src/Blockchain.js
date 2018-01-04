let {Block}=require('./contracts/Block.js');
const request=require('request');

/*
This class add, store the entire chain of block chain
*/
module.exports.BlockChain=class{
    constructor(){
        this.current_transactions=[];
        this.chain=[this.createGenesisBlock()];
        this.difficulty=2; //this property is used to increase the computing time while applying proof of work
        this.nodes=[];  //this will hold the list of nodes in the network.
    }

    //Creates first block for the application
    createGenesisBlock(){
        return new Block(0,'28/12/2017','this is genesis block','100');
    }

    //gets the last added block in the chain
    getLatestBlock(){
        return this.chain[this.chain.length-1];
    }

    //Add new tranasaction 
    addTransaction(data){
        this.current_transactions.push(data);
    }

    //Add new block to chain
    addBlock(){
        var previousBlock=this.getLatestBlock();
        var block = new Block(previousBlock.index+1,new Date(),this.current_transactions,previousBlock.hash);       
        block.mineBlock(this.difficulty);
        this.chain.push(block);

        //clearing transactions that have been pushed to blockchain
        this.current_transactions=[];

        return block; //this will be used in web application to send info of block created to caller
    }

    //Verify if chain is valid or not
    isChainValid(chainToVerify) {
        if(chainToVerify==null){
            chainToVerify=this.chain;
        }
        for (let chainIndex = 1; chainIndex < chainToVerify.length; chainIndex++){
            let currentBlock = chainToVerify[chainIndex];
            let previousBlock = chainToVerify[chainIndex - 1];

            //either hash is not matching or previous hash is not matching
            if (currentBlock.hash !== currentBlock.calculateHash()
            || currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }

    //register new nodes
    addNodes(nodesArr){
        for(let nodeIndex=0;nodeIndex < nodesArr.length; nodeIndex++){
            this.nodes.push(nodesArr[nodeIndex]);
        }
        return true;
    }

    //resolve conflicts of chain when new nodes are added
    resolveconflict(callBack){
        this.assignMaxChainFromNeibhourNode(0,this.chain,false,callBack)
    }

    //make call to node in network and check if chain is bigger then current one
    assignMaxChainFromNeibhourNode(nodeIndex,currentChain, isChainModified,callBack){
        if(currentChain==null){
            currentChain=this.chain;
        }
        
        let currentChainLength=currentChain.length;
        if(nodeIndex==this.nodes.length){
             return callBack(isChainModified);               
        }
        
        request(this.nodes[nodeIndex]+'/chain',{json:true},(err,response,data)=>{
            let newChain=currentChain;
            let newNodeIndex=nodeIndex+1;
            let chainModified=isChainModified;
            if(data.length>currentChainLength && isChainValid(data.chain)){
                newChain=data.chain;    
                chainModified=true;            
            }
            return this.assignMaxChainFromNeibhourNode(newNodeIndex,newChain,chainModified,callBack);
        });
    }
}