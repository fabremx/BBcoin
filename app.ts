import { Block } from "./block";
import sha256 from "crypto-js/sha256";

export default class App {
  blockchain: Block[];

  constructor() {
    this.blockchain = [this.getGenesisBlock()];
  }

  displayBlockChain() {
    console.log(this.blockchain);
  }

  getGenesisBlock() {
    const index = 0;
    const previousHash = "0";
    const timestamp = 1465154705;
    const data = "Genesis block";

    const hash = sha256(index + previousHash + timestamp + data).toString();

    return new Block(index, previousHash, timestamp, data, hash);
  }

  isNewBlockValid(previousBlock: Block, newBlock: Block) {
    if (previousBlock.index + 1 !== newBlock.index) {
      console.error("Block Invalid: invalid index");
      return false;
    } else if (previousBlock.hash !== newBlock.previousHash) {
      console.error("Block Invalid: invalid previous hash");
      return false;
    } else if (newBlock.hash !== newBlock.calculateHash()) {
      console.error("Block Invalid: invalid hash");
      return false;
    }

    return true;
  }

  isBlockchainValid(blockchain: Block[]) {
    if (
      JSON.stringify(blockchain[0]) !== JSON.stringify(this.getGenesisBlock())
    ) {
      console.error("Block Invalid: invalid genesis block");
      return false;
    }

    for (let index = 1; index < blockchain.length; index++) {
      if (
        index !== blockchain.length - 1 &&
        !this.isNewBlockValid(blockchain[index], blockchain[index + 1])
      ) {
        return false;
      }
    }

    return true;
  }

  replaceChain(currentBlockchain: Block[], newBlockchain: Block[]) {
    if (
      this.isBlockchainValid(newBlockchain) &&
      newBlockchain.length > currentBlockchain.length
    ) {
      return newBlockchain;
    }

    return currentBlockchain;
  }
}
