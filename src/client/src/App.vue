<template>
  <div id="app">
    <BlockchainInfo />
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
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import BlockchainInfo from "./components/BlockchainInfo.vue";
import WalletInfo from "./components/WalletInfo.vue";
import Transactions from "./components/Transactions.vue";
import * as elliptic from "elliptic";

@Component({
  components: {
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
