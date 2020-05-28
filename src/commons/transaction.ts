import sha256 from "crypto-js/sha256";
import "./elliptic-types";
import * as elliptic from "elliptic";
var EC = elliptic.ec;
var ec = new EC("secp256k1");

export class Transaction {
  fromAddress: string;
  toAddress: string;
  amount: number;
  signature: any[] = [];

  constructor(fromAddress: string, toAddress: string, amount: number) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }

  calculateHash() {
    return sha256(this.fromAddress + this.toAddress + this.amount).toString();
  }

  signTransaction(signingKey: any): void {
    /* In an normal case we have to verify that you can give money only from your own wallet.
     ** However in this demo we omit this validation. */

    const hashTx = this.calculateHash();
    const sig = signingKey.sign(hashTx, "base64");
    this.signature = sig.toDER("hex");
  }

  isValid(): boolean {
    if (this.fromAddress === "null") return true;

    if (!this.signature || this.signature.length === 0) {
      return false;
    }

    const publicKey = ec.keyFromPublic(this.fromAddress, "hex");
    return publicKey.verify(this.calculateHash(), this.signature);
  }
}
