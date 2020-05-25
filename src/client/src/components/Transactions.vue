<template>
  <div class="transaction__container">
    <h2>Transaction</h2>

    <select v-model="selectedFromAddress">
      <option disabled value>Choisissez</option>
      <option>{{ myWalletAddress }}</option>
      <option>Wallet 2</option>
      <option>Wallet 3</option>
    </select>

    <select v-model="selectedToAddress">
      <option disabled value>Choisissez</option>
      <option>{{ myWalletAddress }}</option>
      <option>Wallet 2</option>
      <option>Wallet 3</option>
    </select>

    <input v-model.number="amount" placeholder="Amount" type="number" />

    <button v-on:click="createNewTransaction()">Ajouter</button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import * as utils from "../utils";
import { Transaction } from "../../../commons/transaction";

@Component
export default class Transactions extends Vue {
  @Prop() keyPairs!: any;
  @Prop() myWalletAddress!: string;

  private amount = 0;
  private selectedFromAddress = "";
  private selectedToAddress = "";

  public createNewTransaction() {
    const transaction = new Transaction(
      this.selectedFromAddress,
      this.selectedToAddress,
      this.amount
    );

    transaction.signTransaction(this.keyPairs);

    utils.createNewTransaction(transaction);
  }
}
</script>
