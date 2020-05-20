export class Transaction {
  fromAddress: string | null;
  toAddress: string | null;
  amount: number;

  constructor(
    fromAddress: string | null,
    toAddress: string | null,
    amount: number
  ) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }
}
