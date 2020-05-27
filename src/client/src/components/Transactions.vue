<template>
  <div class="transaction__component">
    <h3>Transaction</h3>

    <div class="transaction_selects">
      <div class="transaction_selects--container">
        <b-field label="From" class="from">
          <b-select placeholder="Select a wallet" expanded="true">
            <option v-for="wallet in wallets" :value="wallet" :key="wallet">
              {{ wallet }}
            </option>
          </b-select>
        </b-field>
      </div>

      <div class="transaction_selects--container">
        <b-field label="To" class="to">
          <b-select placeholder="Select a wallet" expanded="true">
            <option v-for="wallet in wallets" :value="wallet" :key="wallet">
              {{ wallet }}
            </option>
          </b-select>
        </b-field>
      </div>
    </div>

    <b-field>
      <b-input placeholder="Amount" type="number"> </b-input>
    </b-field>

    <b-button type="is-primary" v-on:click="createNewTransaction()" outlined
      >Add Transaction</b-button
    >
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
  private wallets = ["My Wallet", "Wallet 2", "Wallet 3"];

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

<style scoped>
.transaction__component {
  width: 35%;
  margin-right: 20px;
  padding: 20px 25px;
  background-color: white;
  border-radius: 5px;
  -webkit-box-shadow: 2px 4px 8px -2px rgba(119, 119, 119, 0.5);
  -moz-box-shadow: 2px 4px 8px -2px rgba(119, 119, 119, 0.5);
  box-shadow: 2px 4px 8px -2px rgba(119, 119, 119, 0.5);
}

.transaction__component h3 {
  margin: 0 0 15px;
  color: #595959;
  font-size: 17px;
  font-weight: 600;
}

.transaction_selects {
  display: flex;
  margin-bottom: 10px;
}

.transaction_selects--container {
  width: 50%;
}
.transaction_selects .from {
  margin-right: 10px;
}
</style>
