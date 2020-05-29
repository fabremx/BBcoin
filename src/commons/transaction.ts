import sha256 from "crypto-js/sha256";

export class Transaction {
  fromAddress: string;
  toAddress: string;
  amount: number;

  constructor(fromAddress: string, toAddress: string, amount: number) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }

  calculateHash() {
    return sha256(this.fromAddress + this.toAddress + this.amount).toString();
  }
}
