<template>
  <div class="wallet__info">
    <h3>My Wallet Amount</h3>

    <div class="wallet__info_amount">
      <div class="wallet__info_amount--img">
        <img src="../assets/money.png" />
      </div>
      <div class="wallet__info_amount--value">{{ walletAmount }} b</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import * as utils from "../utils";
import { MY_WALLET_ADDRESS } from "../../../config/env";

@Component
export default class WalletInfo extends Vue {
  private walletAmount: number | null = null;

  async created() {
    this.walletAmount = await utils.getAmmountWallet(MY_WALLET_ADDRESS);
  }
}
</script>

<style scoped>
.wallet__info {
  margin-right: 20px;
  padding: 20px 25px 0;
  border-radius: 5px;
  -webkit-box-shadow: 2px 4px 8px -2px rgba(119, 119, 119, 0.5);
  -moz-box-shadow: 2px 4px 8px -2px rgba(119, 119, 119, 0.5);
  box-shadow: 2px 4px 8px -2px rgba(119, 119, 119, 0.5);
  background: linear-gradient(to right, #9bd161, #82aa52);
  color: white;
}
.wallet__info h3 {
  margin: 0 0 15px;
  font-size: 18px;
  font-weight: 700;
}

.wallet__info_amount {
  display: flex;
  align-items: center;
  margin-top: 30px;
}

.wallet__info_amount--img {
  width: 90px;
}
.wallet__info_amount--value {
  margin-left: 20px;
  font-size: 60px;
}
</style>
