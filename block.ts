import sha256 from "crypto-js/sha256";

export class Block {
  index: number;
  previousHash: string;
  timestamp: number;
  data: any;
  hash: string;

  constructor(
    index: number,
    previousHash: string,
    timestamp: number,
    data: any,
    hash: string
  ) {
    this.index = index;
    this.previousHash = previousHash;
    this.timestamp = timestamp;
    this.data = data;
    this.hash = hash;
  }

  calculateHash() {
    return sha256(
      this.index + this.previousHash + this.timestamp + this.data
    ).toString();
  }
}
