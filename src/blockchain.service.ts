import { Block } from "./block";
import sha256 from "crypto-js/sha256";

export default class BlockchainService {
  displayBlockChain(blockchain: Block[]) {
    console.log(blockchain);
  }

  static getGenesisBlock(): Block {
    const index = 0;
    const previousHash = "0";
    const timestamp = 1465154705;
    const data = "Genesis block";
    const hash = sha256(index + previousHash + timestamp + data).toString();

    return new Block(index, previousHash, timestamp, data, hash);
  }

  calculateHash(
    index: number,
    previousHash: string,
    timestamp: number,
    data: any
  ) {
    return sha256(index + previousHash + timestamp + data).toString();
  }

  generateNextBlock(blockchain: Block[], newBlockData: any): Block {
    const previousBlock: Block = this.getLatestBlock(blockchain);
    const newBlockIndex = previousBlock.index + 1;
    const newBlockTimestamp = new Date().getTime();
    const newBlockHash = this.calculateHash(
      newBlockIndex,
      previousBlock.hash,
      newBlockTimestamp,
      newBlockData
    );

    return new Block(
      newBlockIndex,
      previousBlock.hash,
      newBlockTimestamp,
      newBlockData,
      newBlockHash
    );
  }

  getLatestBlock(blockchain: Block[]): Block {
    const length = blockchain.length;
    return blockchain[length - 1];
  }

  isNewBlockValid(previousBlock: Block, newBlock: Block): Boolean {
    if (previousBlock.index + 1 !== newBlock.index) {
      console.error("Block Invalid: invalid index");
      return false;
    } else if (previousBlock.hash !== newBlock.previousHash) {
      console.error("Block Invalid: invalid previous hash");
      return false;
    } else if (
      newBlock.hash !==
      this.calculateHash(
        newBlock.index,
        newBlock.previousHash,
        newBlock.timestamp,
        newBlock.data
      )
    ) {
      console.error("Block Invalid: invalid hash");
      return false;
    }

    return true;
  }

  isBlockchainValid(blockchain: Block[]): Boolean {
    if (
      JSON.stringify(blockchain[0]) !==
      JSON.stringify(BlockchainService.getGenesisBlock())
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

  replaceChain(currentBlockchain: Block[], newBlockchain: Block[]): Block[] {
    if (
      this.isBlockchainValid(newBlockchain) &&
      newBlockchain.length > currentBlockchain.length
    ) {
      return newBlockchain;
    }

    return currentBlockchain;
  }
}
