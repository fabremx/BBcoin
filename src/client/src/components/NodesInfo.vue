<template>
  <div class="blockhain__info_component">
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
        <tr>
          <td colspan="2">
            <h4>Node {{ index + 1 }}</h4>
          </td>
        </tr>
        <tr class="even">
          <td class="prop">URL</td>
          <td class="value">{{ node.url }}</td>
        </tr>
        <tr class="odd">
          <td class="prop">Clients</td>
          <td class="value">{{ node.clients.join(", ") }}</td>
        </tr>
        <tr class="even">
          <td class="prop">Servers</td>
          <td class="value">{{ node.servers.join(", ") }}</td>
        </tr>
        <tr class="odd">
          <td colspan="2">
            <h6>Pending transactions</h6>
          </td>
        </tr>
        <tr>
          <td class="transaction" colspan="2">
            <div
              v-for="(transaction, index) in node.pendingTransactions"
              :key="index"
              v-bind:class="{ even: index % 2 === 0, odd: index % 2 !== 0 }"
            >
              <span class="prop">from</span>
              <span class="value">{{ transaction.fromAddress }}</span>
              <span class="prop">to</span>
              <span class="value">{{ transaction.toAddress }}</span>
              <span class="prop">amount</span>
              <span class="value">{{ transaction.amount }}</span>
            </div>
          </td>
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
        const nodeInfo: any = await utils.getNodesInfo(nodeUrl);
        nodesInfo.push({ url: nodeUrl, ...nodeInfo });
      }
    );

    return nodesInfo;
  }
}
</script>

<style scoped>
.blockhain__info_component {
  margin-bottom: 30px;
}

.blockhain__info_component p {
  margin-bottom: 10px;
  font-size: 14px;
}
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
  background-color: white;
  border-radius: 5px;
  -webkit-box-shadow: 2px 4px 8px -2px rgba(119, 119, 119, 0.5);
  -moz-box-shadow: 2px 4px 8px -2px rgba(119, 119, 119, 0.5);
  box-shadow: 2px 4px 8px -2px rgba(119, 119, 119, 0.5);
}

td h4 {
  color: #595959;
  margin: 2px 0;
  font-weight: 600;
}

td h6 {
  color: #595959;
  font-size: 14px;
  font-weight: 600;
}

.nodeInfo__table tr {
  text-align: left;
}
.nodeInfo__table td {
  padding: 5px 10px;
  text-align: center;
}
.nodeInfo__table tr.even {
  background-color: #f6f6f6;
}
.nodeInfo__table tr.odd {
  background-color: white;
}

td.prop {
  color: #595959;
  font-size: 13px;
  float: left;
}
td.value {
  color: #9b9b9b;
  font-size: 12px;
}

td.transaction {
  padding: 0;
  text-align: left;
}
td.transaction div {
  display: flex;
  align-items: baseline;
  padding: 5px 10px;
}
td.transaction div.even {
  background-color: #f6f6f6;
}
td.transaction div.odd {
  background-color: white;
}
td.transaction .prop {
  color: #595959;
  font-size: 13px;
}
td.transaction .value {
  margin-left: 5px;
  margin-right: 15px;
  color: #9b9b9b;
  font-size: 12px;
}
</style>
