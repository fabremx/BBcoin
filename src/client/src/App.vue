<template>
  <div id="app">
    <BlockchainInfo myWalletAddress="myWalletAddress" />
    <WalletInfo myWalletAddress="myWalletAddress" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import BlockchainInfo from "./components/BlockchainInfo.vue";
import WalletInfo from "./components/WalletInfo.vue";
import Transaction from "./components/Transactions.vue";

@Component({
  components: {
    BlockchainInfo,
    WalletInfo,
    Transaction
  }
})
export default class App extends Vue {
  private myWalletAddress = "myWallet";
}
</script>
