<template>
  <div class="wallet__info_component">
    <div class="wallet__info_container wallet__info_container--account">
      <h3>My Account info</h3>
      <div class="wallet__info">
        <div class="wallet__info_block">
          <div class="wallet__info--prop">Public Key</div>
          <div class="wallet__info--value">
            {{ keyPairs.getPublic("hex") }}
          </div>
        </div>
        <div class="wallet__info_block">
          <div class="wallet__info--prop">Private Key</div>
          <div class="wallet__info--value">
            {{ keyPairs.getPrivate("hex") }}
          </div>
        </div>
      </div>
    </div>

    <div class="wallet__info_container wallet__info_container--wallet">
      <h3>My Wallet</h3>
      <div class="wallet__info wallet__info_amount">
        <div class="wallet__info_block">
          <div class="wallet__info--prop">Wallet address</div>
          <div class="wallet__info--value">
            {{ keyPairs.getPublic("hex") }}
          </div>
        </div>

        <div class="wallet__info_block">
          <div class="wallet__info--prop">Wallet Amount</div>
          <div class="wallet__info--value">{{ walletAmount }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import * as utils from "../utils";

@Component
export default class WalletInfo extends Vue {
  @Prop() readonly keyPairs!: string;
  @Prop() readonly myWalletAddress!: string;

  private walletAmount: number | null = null;

  async created() {
    this.walletAmount = await utils.getAmmountWallet(this.myWalletAddress);
  }
}
</script>

<style scoped>
.wallet__info_component {
  display: flex;
  width: 50%;
}

.wallet__info_container {
  background-color: white;
  padding: 20px 25px 0;
  border-radius: 5px;
  -webkit-box-shadow: 2px 4px 8px -2px rgba(119, 119, 119, 0.5);
  -moz-box-shadow: 2px 4px 8px -2px rgba(119, 119, 119, 0.5);
  box-shadow: 2px 4px 8px -2px rgba(119, 119, 119, 0.5);
}

.wallet__info_container--account {
  width: 48%;
  margin-right: 15px;
  color: white;
  background: linear-gradient(to right, #8fc9f9, #3a9bea);
}
.wallet__info_container--wallet {
  width: 48%;
  color: white;
  background: linear-gradient(to right, #9bd161, #82aa52);
}

.wallet__info_container h3 {
  margin: 0 0 15px;
  font-size: 18px;
  font-weight: 700;
}

.wallet__info_block {
  margin-bottom: 20px;
}

.wallet__info_amount {
  margin-top: 20px;
}

.wallet__info--prop {
  font-weight: 600;
  font-size: 15px;
  margin-bottom: 5px;
}
.wallet__info--value {
  overflow-wrap: break-word;
  font-size: 12px;
}
</style>
