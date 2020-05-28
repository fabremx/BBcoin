import { Transaction } from "./transaction";

export default class Message {
  type: string;
  transactions: Transaction[];

  constructor(type: string, transactions: Transaction[]) {
    this.type = type;
    this.transactions = transactions;
  }
}
