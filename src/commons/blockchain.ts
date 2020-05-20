import { Block } from "./block";

export class Blockchain {
  public blockchain: Block[] = [];
  difficulty: number = 2;

  constructor() {
    this.blockchain.push(this.getGenesisBlock());
  }

  displayBlockchain() {
    console.log(this.blockchain);
  }

  getGenesisBlock(): Block {
    const index = 0;
    const previousHash = "0";
    const timestamp = 1465154705;
    const data = "Genesis block";

    return new Block(index, previousHash, timestamp, data);
  }

  generateNextBlock(newBlockData: any): Block {
    const previousBlock: Block = this.getLatestBlock();
    const newBlockIndex = previousBlock.index + 1;
    const newBlockTimestamp = new Date().getTime();

    return new Block(
      newBlockIndex,
      previousBlock.hash,
      newBlockTimestamp,
      newBlockData
    );
  }

  getLatestBlock(): Block {
    return this.blockchain[this.blockchain.length - 1];
  }

  isNewBlockValid(previousBlock: Block, newBlock: Block): Boolean {
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

  isBlockchainValid(blockchain: Block[]): Boolean {
    if (
      JSON.stringify(blockchain[0]) !== JSON.stringify(this.getGenesisBlock())
    ) {
      console.error("Blockchain Invalid: invalid genesis block");
      return false;
    }

    for (let index = 1; index < blockchain.length; index++) {
      if (
        index !== blockchain.length - 1 &&
        !this.isNewBlockValid(blockchain[index], blockchain[index + 1])
      ) {
        console.error(
          `Blockchain Invalid: invalid block: ${blockchain[index]}`
        );
        return false;
      }
    }

    console.log("Blockchain valid");
    return true;
  }

  replaceChain(newBlockchain: Block[]): Block[] {
    if (
      this.isBlockchainValid(newBlockchain) &&
      newBlockchain.length > this.blockchain.length
    ) {
      console.log("Keep actual blockchain");
      return newBlockchain;
    }

    console.log("Replace blockchain with the new one");
    return this.blockchain;
  }
}

export default new Blockchain();
