<template>
  <div class="blockhain__info">
    <h2>Blockchain network information</h2>
    <p>
      Noeud présent sur le réseaux:
      <span class="blockhain__info--number">{{ nodesInfo.length }}</span>
    </p>

    <div class="nodeInfo__container">
      <table v-for="(node, index) in nodesInfo" :key="node.url" class="nodeInfo__table">
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
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import * as utils from "../utils";

@Component
export default class NodesInfo extends Vue {
  private nodesInfo: any[] = [];

  async created() {
    this.nodesInfo = await this.getNodesInfo();
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
}
</script>

<style scoped>
.blockhain__info--number {
  margin-left: 7px;
  font-size: 19px;
  font-weight: 800;
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
</style>
