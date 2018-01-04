let {BlockChain}=require('./Blockchain.js');
let {Block}=require('./contracts/Block.js');

let blockChain= new BlockChain();

//running the application
blockChain.addTransaction("This is test");
blockChain.addTransaction("This is test2");
blockChain.addBlock();
console.log(JSON.stringify(blockChain,null,4));

//adding second block
blockChain.addTransaction("This is test3");
blockChain.addTransaction("This is test4");
blockChain.addBlock();
console.log(JSON.stringify(blockChain,null,4));
//verify the chain
 console.log('Blockchain valid? ' + blockChain.isChainValid());

//explicityly trying to modify data in chain
blockChain.chain[1].data="infringement";
blockChain.chain[1].hash=blockChain.chain[1].calculateHash();
console.log('Blockchain valid? ' + blockChain.isChainValid());

//console.log(JSON.stringify(blockChain,null,4));

