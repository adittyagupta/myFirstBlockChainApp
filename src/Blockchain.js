var {Block}=require('./contracts/Block.js');

/*
This class add, store the entire chain of block chain
*/
module.exports.BlockChain=class{
    constructor(){
        this.current_transactions=[];
        this.chain=[this.createGenesisBlock()];
        this.difficulty=2; //this property is used to increase the computing time while applying proof of work
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
    isChainValid() {
        for (let i = 1; i < this.chain.length; i++){
            var currentBlock = this.chain[i];
            var previousBlock = this.chain[i - 1];

//either hash is not matching or previous hash is not matching
            if (currentBlock.hash !== currentBlock.calculateHash()
            || currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }
}