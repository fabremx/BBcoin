<template>
  <div class="wallet__info">
    <h2>My Wallet</h2>
    <div class="wallet__amount">
      <p>
        Coin présent sur le portefeuille:
        <span class="wallet__amount--number">{{ walletAmount }}</span>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import * as utils from "../utils";

@Component
export default class WalletInfo extends Vue {
  @Prop() readonly myWalletAddress!: string;

  private walletAmount: number | null = null;

  async created() {
    this.walletAmount = await utils.getAmmountWallet(this.myWalletAddress);
  }
}
</script>
