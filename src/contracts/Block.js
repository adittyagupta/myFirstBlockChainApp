const SHA256 = require("crypto-js/sha256");

/*
    This class is contract for creating block and calculating its hash
*/
module.exports.Block=class{
    constructor(index, timeStamp, data, previousHash=''){
        this.index=index;
        this.timeStamp=timeStamp;
        this.data=data;
        this.previousHash=previousHash;
        this.hash=this.calculateHash();
        this.nonce=0;
    }

//calculates the hash for the block
    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

//this method is used to mine the noince AKA proof of work done by miners while validating the transactions.
//We will generate has till our desired has with ending "0" is found
      mineBlock(difficulty) {
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
        this.nonce++;
        this.hash = this.calculateHash();
    }
   // console.log("BLOCK MINED: " + this.hash);
  }
}