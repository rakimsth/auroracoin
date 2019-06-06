let SHA256 = require("crypto-js/sha256");

class Transaction {
 constructor(fromOwner, toOwner, amount) {
   this.fromOwner = fromOwner;
   this.toOwner = toOwner;
   this.amount = amount;
 }
}
class Block {
 constructor(transactions, index, previousHash) {
   this.index = index;
   this.timestamp = new Date();
   this.data = transactions;
   this.previousHash = previousHash;
   this.hash = "";
   this.nonce = 0;
 }
 calculateHash() {
   return SHA256(
     this.index +
       this.timestamp +
       this.nonce +
       JSON.stringify(this.transactions) +
       this.previousHash
   ).toString();
 }
 mineBlock(difficulty) {
   while (
     this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
   ) {
     this.nonce++;
     this.hash = this.calculateHash();
   }
 }
}

class Blockchain {
 constructor() {
   this.chain = [this.createGenesisBlock()];
   this.pendingTransaction = [];
   //set the level of the mining difficulty
   this.difficulty = 4;
   this.miningReward = 100;
 }
 createGenesisBlock() {
   return new Block("", 0, "000000");
 }
 createTransaction(transaction) {
   this.pendingTransaction.push(transaction);
 }
 getLatestBlock() {
   return this.chain[this.chain.length - 1];
 }
 minePendingTransactions(mineRewardAddress) {
   let block = new Block(
     this.pendingTransactions,
     this.getLatestBlock().index + 1,
     this.getLatestBlock().hash
   );
   block.mineBlock(this.difficulty);
   console.log("block mined");
   this.chain.push(block);
   this.pendingTransactions = [
     new Transaction(null, mineRewardAddress, this.miningReward)
   ];
 }
 //   addBlock(newBlockData) {
 //     newBlockData.previousHash = this.getLatestBlock().hash;
 //     newBlockData.index = this.getLatestBlock().index + 1;
 //     let newBlock = new Block(
 //       newBlockData.data,
 //       newBlockData.index,
 //       newBlockData.previousHash
 //     );
 //     newBlock.hash = newBlock.calculateHash();
 //     this.chain.push(newBlock);
 //   }
 isValid() {
   for (let i = 1; i < this.chain.length; i++) {
     const previousBlock = this.chain[i - 1];
     const currentBlock = this.chain[i];
     if (
       currentBlock.hash !== currentBlock.calculateHash() ||
       currentBlock.previousHash !== previousBlock.hash
     ) {
       return false;
     }
   }
   return true;
 }
}
let auroraCoin = new Blockchain();
auroraCoin.createTransaction(new Transaction("address 1 ", "address 2", 50));
auroraCoin.createTransaction(new Transaction("address 3", "address 4", 100));
console.log("starting miner ... !!");
auroraCoin.minePendingTransactions("aurora-address");
console.log(auroraCoin);