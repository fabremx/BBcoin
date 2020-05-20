import sha256 from "crypto-js/sha256";

export class Block {
  index: number;
  previousHash: string;
  timestamp: number;
  data: any;
  hash: string;
  nonce: number;

  constructor(
    index: number,
    previousHash: string = "",
    timestamp: number,
    data: any
  ) {
    this.index = index;
    this.previousHash = previousHash;
    this.timestamp = timestamp;
    this.data = data;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash(): string {
    return sha256(
      this.index + this.previousHash + this.timestamp + this.data
    ).toString();
  }

  mineBlock(difficulty: number) {
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
    ) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log("BLOCK MINED: " + this.hash);
  }
}
