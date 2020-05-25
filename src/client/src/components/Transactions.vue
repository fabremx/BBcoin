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
import { Component, Prop, Vue } from "vue-property-decorator";
import * as utils from "../utils";

@Component
export default class Transaction extends Vue {
  @Prop() readonly myWalletAddress!: string;

  private amount = 0;
  private selectedFromAddress = "";
  private selectedToAddress = "";
  private key: object = {
    privateKey: "",
    publicKey: "",
  };

  public createNewTransaction() {
    console.log(this.selectedFromAddress, this.selectedToAddress, this.amount);

    utils.createNewTransaction(
      this.selectedFromAddress,
      this.selectedToAddress,
      this.amount
    );
  }
}
</script>
