import sha256 from "crypto-js/sha256";

export class Transaction {
  fromAddress: string;
  toAddress: string;
  amount: number;
  signature: any[] = [];

  constructor(
    fromAddress: string,
    toAddress: string,
    amount: number,
    signature?: any[]
  ) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
    this.signature = signature || [];
  }

  calculateHash() {
    return sha256(this.fromAddress + this.toAddress + this.amount).toString();
  }
}
