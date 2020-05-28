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

  getGenesisBlock(): Block {
    const timestamp = 0;
    const genesisData = [new Transaction("null", "null", 0)];
    const previousHash = "0";

    return new Block(timestamp, genesisData, previousHash);
  }

  getLatestBlock(): Block {
    return this.blockchain[this.blockchain.length - 1];
  }

  addTransaction(transaction: Transaction): void {
    if (!transaction.fromAddress || !transaction.toAddress) {
      throw new Error("Transaction must include from and to address");
    }

    if (!transaction.isValid()) {
      throw new Error("Cannot add invalid transaction to chain");
    }

    if (transaction.amount <= 0) {
      throw new Error("Transaction amount should be higher than 0");
    }

    if (
      this.getBalanceOfAddress(transaction.fromAddress) < transaction.amount
    ) {
      throw new Error("Not enough balance");
    }

    this.pendingTransactions.push(transaction);
  }

  minePendingTransactions(miningRewardAddress: string) {
    const block = new Block(
      Date.now(),
      this.pendingTransactions,
      this.getLatestBlock().hash
    );

    block.mineBlock(this.difficulty);
    this.blockchain.push(block);

    // Reset the pending transactions and send the mining reward
    this.pendingTransactions = [
      new Transaction("null", miningRewardAddress, this.miningReward)
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

  getBalanceOfAddress(walletAddress: string): number {
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

  getAllTransactionsForWallet(walletAddress: string): Transaction[] {
    const transactions = [];

    for (const block of this.blockchain) {
      for (const transaction of block.transactions) {
        if (
          transaction.fromAddress === walletAddress ||
          transaction.toAddress === walletAddress
        ) {
          transactions.push(transaction);
        }
      }
    }

    return transactions;
  }
}

export default new Blockchain();
