<template>
  <div class="blockhain__info">
    <h2>Blockchain network information</h2>
    <p>
      Noeud présent sur le réseaux:
      <span class="blockhain__info--number">{{ nodesInfo.length }}</span>
    </p>

    <div class="nodeInfo__container">
      <table
        v-for="(node, index) in nodesInfo"
        :key="node.url"
        class="nodeInfo__table"
      >
        <tr class="nodeInfo__table--firstLine">
          <td colspan="2">Node {{ index + 1 }}</td>
        </tr>
        <tr>
          <td>URL</td>
          <td>{{ node.url }}</td>
        </tr>
        <tr>
          <td>Clients</td>
          <td>{{ node.clients.join(", ") }}</td>
        </tr>
        <tr>
          <td>Servers</td>
          <td>{{ node.servers.join(", ") }}</td>
        </tr>
      </table>
    </div>

    <h2>Blockchain state</h2>
    <div class="blockchain__container">
      <div
        v-for="(block, index) in blockchain"
        :key="block.hash"
        class="blockchain__block__container"
      >
        <div class="blockchain__block">
          <div>
            <span class="blockchain__block--prop">timestamp:</span>
            <span class="blockchain__block--value">{{ block.timestamp }}</span>
          </div>

          <div>
            <span class="blockchain__block--prop">previousHash:</span>
            <span class="blockchain__block--value">{{
              block.previousHash
            }}</span>
          </div>

          <div>
            <span class="blockchain__block--prop">hash:</span>
            <span class="blockchain__block--value">{{ block.hash }}</span>
          </div>

          <div>
            <span class="blockchain__block--prop">nonce:</span>
            <span class="blockchain__block--value">{{ block.nonce }}</span>
          </div>
        </div>

        <div
          v-if="index !== blockchain.length - 1"
          class="blockchain__arrow"
        ></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Block } from "../../../commons/block";
import * as utils from "../utils";

@Component
export default class Blockchain extends Vue {
  private nodesInfo: any[] = [];
  private blockchain: Block[] = [];

  async created() {
    this.nodesInfo = await this.getNodesInfo();

    if (this.nodesInfo.length) {
      this.blockchain = await this.getBlockchain();
      // this.blockchain.push(
      //   {
      //     timestamp: 123,
      //     previousHash: "prg6534d8hrg6gbr",
      //     hash: "heash",
      //     nonce: 2,
      //   },
      //   {
      //     timestamp: 123,
      //     previousHash: "prg6534d8hrg6gbr",
      //     hash: "heash",
      //     nonce: 2,
      //   }
      // );
    }
  }

  public async getNodesInfo() {
    const nodesConnectedOnNetwork = await utils.getNodesConnectedOnNetwork();
    const nodesInfo: object[] = [];

    await utils.asyncForEach(
      nodesConnectedOnNetwork,
      async (nodeUrl: string) => {
        const nodeInfo = await utils.getNodesInfo(nodeUrl);
        nodesInfo.push({ url: nodeUrl, ...nodeInfo });
      }
    );

    return nodesInfo;
  }

  public async getBlockchain(): Promise<Block[]> {
    return await utils.getBlockchain();
  }
}
</script>

<style scoped>
.blockhain__info--number {
  font-size: 19px;
  font-weight: 800;
  margin-left: 7px;
}

.nodeInfo__container {
  display: flex;
}

.nodeInfo__table {
  max-width: 400px;
  margin-right: 20px;
  border-collapse: collapse;
}

.nodeInfo__table td {
  padding: 5px 10px;
  border: 1px solid black;
  text-align: center;
}

.blockchain__block__container {
  position: relative;
  width: 240px;
}

.blockchain__container {
  display: flex;
}

.blockchain__block {
  width: 185px;
  padding: 5px 10px;
  border: 1px solid black;
}

.blockchain__block div {
  display: flex;
}

.blockchain__block--prop {
  font-weight: 500;
}

.blockchain__block--value {
  margin-left: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.blockchain__arrow {
  position: absolute;
  right: 0;
  top: 50%;
  border-top: 3px solid black;
  width: 34px;
}
</style>
