import { Transaction } from "./transaction";

export default class Message {
  type: string;
  transaction: Transaction;

  constructor(type: string, transaction: Transaction) {
    this.type = type;
    this.transaction = transaction;
  }
}
