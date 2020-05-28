<template>
  <div id="app">
    <h1>Blockchain monitoring</h1>
    <div class="blockchain__network_container">
      <NodesInfo />
      <BlockchainInfo />
    </div>

    <div class="transactions_container">
      <WalletInfo />
      <Transactions />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import NodesInfo from "./components/NodesInfo.vue";
import BlockchainInfo from "./components/BlockchainInfo.vue";
import WalletInfo from "./components/WalletInfo.vue";
import Transactions from "./components/Transactions.vue";

@Component({
  components: {
    NodesInfo,
    BlockchainInfo,
    WalletInfo,
    Transactions
  }
})
export default class App extends Vue {}
</script>

<style>
html,
body {
  height: 100%;
  background-color: #f5f6fd;
}

#app h1 {
  padding: 20px 20px 0 20px;
  font-size: 27px;
  font-weight: 700;
}

.blockchain__network_container {
  margin: 10px 20px 20px;
}
.transactions_container {
  display: flex;
  padding: 20px;
}
</style>
