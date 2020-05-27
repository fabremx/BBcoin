<template>
  <div id="app">
    <h1>Blockchain monitoring</h1>
    <div class="blockchain__network_container">
      <NodesInfo />
      <BlockchainInfo />
    </div>

    <div class="account_container">
      <WalletInfo
        v-bind:keyPairs="keyPairs"
        v-bind:myWalletAddress="myWalletAddress"
      />
      <!-- eslint-disable-next-line prettier/prettier -->
      <Transactions
        v-bind:keyPairs="keyPairs"
        v-bind:myWalletAddress="myWalletAddress"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import NodesInfo from "./components/NodesInfo.vue";
import BlockchainInfo from "./components/BlockchainInfo.vue";
import WalletInfo from "./components/WalletInfo.vue";
import Transactions from "./components/Transactions.vue";
import * as elliptic from "elliptic";

@Component({
  components: {
    NodesInfo,
    BlockchainInfo,
    WalletInfo,
    Transactions
  }
})
export default class App extends Vue {
  private myWalletAddress = null;
  private keyPairs: any;

  created() {
    this.keyPairs = this.generateKeys();
    this.myWalletAddress = this.keyPairs.getPublic("hex");
  }

  generateKeys() {
    const EC = elliptic.ec;
    const ec = new EC("secp256k1");
    return ec.genKeyPair();
  }
}
</script>

<style>
html,
body {
  height: 100%;
}
body {
  background-color: #f5f6fd;
}

#app h1 {
  padding: 20px 20px 0 20px;
  font-size: 27px;
  font-weight: 700;
}

.blockchain__network_container {
  margin: 20px;
}
.account_container {
  display: flex;
  padding: 20px;
}
</style>
