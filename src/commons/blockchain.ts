import { Transaction } from "./transaction";
import { Block } from "./block";

export class Blockchain {
  public blockchain: Block[] = [];
  difficulty: number = 2;
  pendingTransactions: Transaction[] = [];
  miningReward: number = 100;

  constructor() {
    this.blockchain.push(this.getGenesisBlock());
  }

  displayBlockchain() {
    console.log(this.blockchain);
  }

  getGenesisBlock(): Block {
    const timestamp = 0;
    const genesisData = [new Transaction("null", "null", 0)];
    const previousHash = "0";

    return new Block(timestamp, genesisData, previousHash);
  }

  generateNextBlock(newBlockTransaction: Transaction[]): Block {
    const newBlockTimestamp = new Date().getTime();

    return new Block(
      newBlockTimestamp,
      newBlockTransaction,
      this.getLatestBlock().hash
    );
  }

  getLatestBlock(): Block {
    return this.blockchain[this.blockchain.length - 1];
  }

  createTransaction(transaction: Transaction) {
    if (!transaction.fromAddress || !transaction.toAddress) {
      throw new Error("Transaction must include from and to address");
    }

    if (!transaction.isValid()) {
      throw new Error("Cannot add invalid transaction to chain");
    }

    this.pendingTransactions.push(transaction);
  }

  minePendingTransactions(miningRewardAddress: string) {
    const block = new Block(Date.now(), this.pendingTransactions);

    block.mineBlock(this.difficulty);
    this.blockchain.push(block);

    // Reset the pending transactions and send the mining reward
    this.pendingTransactions = [
      new Transaction("null", miningRewardAddress, this.miningReward),
    ];
  }

  isNewBlockValid(previousBlock: Block, newBlock: Block): Boolean {
    if (previousBlock.hash !== newBlock.previousHash) {
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

      if (!blockchain[index].hasValidTransactions()) {
        console.error(
          `Blockchain Invalid: invalid transaction: ${blockchain[index]}`
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

  getBalanceOfAddress(walletAddress: string) {
    let balance = 0;

    for (const block of this.blockchain) {
      for (const transaction of block.transactions) {
        if (transaction.fromAddress === walletAddress) {
          balance -= transaction.amount;
        }

        if (transaction.toAddress === walletAddress) {
          balance += transaction.amount;
        }
      }
    }

    return balance;
  }
}

export default new Blockchain();
