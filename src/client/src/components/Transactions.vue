<template>
  <div class="transaction__component">
    <h3>Transaction</h3>

    <div class="transaction_selects">
      <div class="transaction_selects--container">
        <b-field label="From" class="from">
          <b-select
            v-model="selectedFromAddress"
            placeholder="Select a wallet"
            expanded
          >
            <option v-for="wallet in wallets" :value="wallet" :key="wallet">
              {{ wallet }}
            </option>
          </b-select>
        </b-field>
      </div>

      <div class="transaction_selects--container">
        <b-field label="To" class="to">
          <b-select
            v-model="selectedToAddress"
            placeholder="Select a wallet"
            expanded
          >
            <option v-for="wallet in wallets" :value="wallet" :key="wallet">
              {{ wallet }}
            </option>
          </b-select>
        </b-field>
      </div>
    </div>

    <b-field>
      <b-input placeholder="Amount" type="number" v-model="amount"> </b-input>
    </b-field>

    <b-button
      type="is-primary"
      v-on:click="createNewTransaction()"
      outlined
      :disabled="isButtonDisabled()"
      >Add Transaction</b-button
    >
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import * as utils from "../utils";
import { MY_WALLET_ADDRESS } from "../../../constants/shared";
import { Transaction } from "../../../commons/transaction";

@Component
export default class Transactions extends Vue {
  private amount = 0;
  private selectedFromAddress: string = "";
  private selectedToAddress: string = "";
  private wallets = [MY_WALLET_ADDRESS, "Wallet2", "Wallet3"];

  public createNewTransaction() {
    const transaction = new Transaction(
      this.selectedFromAddress,
      this.selectedToAddress,
      this.amount
    );

    utils.createNewTransaction(transaction);
  }

  isButtonDisabled(): boolean {
    return !this.selectedFromAddress || !this.selectedToAddress || !this.amount;
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
