<template>
  <div class="blockchain__info">
    <h2>Blockchain state</h2>
    <div class="blockchain__container">
      <div
        v-for="(block, index) in blockchain"
        :key="block.hash"
        class="blockchain__block__container"
      >
        <div class="blockchain__block">
          <div class="blockchain__block_title">
            <h4>Block n°{{index + 1}}</h4>
          </div>
          <div class="blockchain__block_first">
            <div class="block__info">
              <div class="block__info--prop">timestamp:</div>
              <div class="block__info--value">{{ block.timestamp }}</div>
            </div>

            <div class="block__info">
              <div class="block__info--prop">previousHash:</div>
              <div class="block__info--value">{{ getCuttedString(block.previousHash) }}</div>
            </div>

            <div class="block__info">
              <div class="block__info--prop">hash:</div>
              <div class="block__info--value">{{ getCuttedString(block.hash) }}</div>
            </div>

            <div class="block__info">
              <div class="block__info--prop">nonce:</div>
              <div class="block__info--value">{{ block.nonce }}</div>
            </div>
          </div>

          <div class="blockchain__block_second">
            <h4>Transactions</h4>
            <div
              v-for="(transaction, index) in block.transactions"
              :key="index"
              class="block__transacttions"
              v-bind:class="[{ even: index % 2 === 0 }, { odd: index % 2 !== 0 }]"
            >
              <div
                class="block__transactions--addresses"
              >{{transaction.fromAddress}} >> {{transaction.toAddress}}</div>
              <div class="block__transactions--amount">{{transaction.amount}}</div>
            </div>
          </div>
        </div>

        <div v-if="index !== blockchain.length - 1" class="blockchain__arrow"></div>
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
  private blockchain: Block[] = [];

  async created() {
    this.blockchain = await this.getBlockchain();
    // this.blockchain.push(
    //   {
    //     timestamp: 123,
    //     previousHash: "prg6534d8hrg6gbr",
    //     hash: "heash",
    //     nonce: 2,
    //     transactions: [
    //       {
    //         fromAddress: "wallet1",
    //         toAddress: "wallet2",
    //         amount: 10
    //       },
    //       {
    //         fromAddress: "wallet1",
    //         toAddress: "wallet2",
    //         amount: 50
    //       },
    //       {
    //         fromAddress: "wallet2",
    //         toAddress: "wallet1",
    //         amount: 40
    //       }
    //     ]
    //   },
    //   {
    //     timestamp: 123,
    //     previousHash: "prg6534d8hrg6gbr",
    //     hash: "heash",
    //     nonce: 2,
    //     transactions: [
    //       {
    //         fromAddress: "wallet1",
    //         toAddress: "wallet2",
    //         amount: 10
    //       },
    //       {
    //         fromAddress: "wallet1",
    //         toAddress: "wallet2",
    //         amount: 50
    //       }
    //     ]
    //   }
    // );
  }

  public async getBlockchain(): Promise<Block[]> {
    return await utils.getBlockchain();
  }

  public getCuttedString(str: string): string {
    if (str.length <= 15) return str;

    return `...${str.substring(str.length - 15, str.length)}`;
  }
}
</script>

<style scoped>
.blockchain__container {
  display: flex;
}
.blockchain__block__container {
  position: relative;
  width: 285px;
}

.blockchain__block {
  width: 250px;
  border-radius: 5px;
  -webkit-box-shadow: 2px 4px 8px -2px rgba(119, 119, 119, 0.5);
  -moz-box-shadow: 2px 4px 8px -2px rgba(119, 119, 119, 0.5);
  box-shadow: 2px 4px 8px -2px rgba(119, 119, 119, 0.5);
}

.blockchain__block_first,
.blockchain__block_second {
  color: #9b9b9b;
}

.blockchain__block_title {
  margin: 0;
  padding: 6px 25px;
  border-radius: 5px 5px 0 0;
  background: linear-gradient(to bottom right, #ff8a94, #feb592);
}

.blockchain__block_title h4 {
  margin: 5px 0;
  color: white;
}

.blockchain__block_first {
  display: flex;
  flex-direction: column;
  padding: 10px 25px;
  border-bottom: 1px solid #e4e7eb;
  background-color: white;
  font-size: 13px;
}

.block__info {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.block__info--prop {
  font-weight: 500;
  color: #4e4f57;
}

.block__info--value {
  margin-left: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.blockchain__block_second {
  border-radius: 0 0 5px 5px;
  background-color: #e9ecf4;
}

.blockchain__block_second h4 {
  margin: 0;
  padding: 5px 25px;
  color: #848484;
}

.block__transacttions {
  display: flex;
  margin: 1px 0;
  padding: 2px 25px;
  align-items: center;
  justify-content: space-between;
}

.block__transacttions.even {
  background-color: white;
}

.block__transacttions.odd {
  background-color: #f6f6f6;
}

.block__transactions--addresses {
  font-size: 12px;
}

.block__transactions--amount {
  margin-left: 10px;
  color: #4e4f57;
  font-size: 19px;
}

.blockchain__arrow {
  position: absolute;
  width: 34px;
  top: 50%;
  right: 0;
  border-top: 3px solid #646464;
}
</style>
