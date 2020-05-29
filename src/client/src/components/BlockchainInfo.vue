<template>
  <div class="blockchain__info">
    <h3>Blockchain state</h3>

    <div class="blockchain__container">
      <div
        v-for="(block, index) in blockchain"
        :key="block.hash"
        class="blockchain__block__container"
      >
        <div class="blockchain__block">
          <div class="blockchain__block_title">
            <h4>BLOCK #{{ index + 1 }}</h4>
            <span>{{ timestampToDate(block.timestamp) }}</span>
          </div>

          <div class="blockchain__block_first">
            <div class="block__info">
              <div class="block__info--prop">PREVIOUS HASH</div>
              <div class="block__info--value valid">{{ block.previousHash }}</div>
            </div>

            <div class="block__info">
              <div class="block__info--prop">HASH</div>
              <div class="block__info--value valid background">{{ block.hash }}</div>
            </div>

            <div class="block__info">
              <div class="block__info--prop">Nonce</div>
              <div class="block__info--value nounce">{{ block.nonce }}</div>
            </div>
          </div>

          <div class="blockchain__block_second">
            <h4>Transactions</h4>
            <div
              v-for="(transaction, index) in block.transactions"
              :key="index"
              class="block__transacttions"
              v-bind:class="[
                { even: index % 2 === 0 },
                { odd: index % 2 !== 0 }
              ]"
            >
              <div class="block__transactions--addresses">
                {{ transaction.fromAddress }}
                <span>></span>
                {{ transaction.toAddress }}
              </div>
              <div class="block__transactions--amount">{{ transaction.amount }} b</div>
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
    //     previousHash:
    //       "51c90c4c57a2a43add073cdb6a515ec5fe7524cda71e43a0b844209191d49fa3 ",
    //     hash:
    //       "51c90c4c57a2a43add073cdb6a515ec5fe7524cda71e43a0b844209191d49fa3 ",
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
    //     previousHash:
    //       "51c90c4c57a2a43add073cdb6a515ec5fe7524cda71e43a0b844209191d49fa3 ",
    //     hash:
    //       "51c90c4c57a2a43add073cdb6a515ec5fe7524cda71e43a0b844209191d49fa3 ",
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

  public timestampToDate(timestamp: number): string {
    const date = new Date(timestamp * 1000);
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];

    const year = date.getFullYear();
    const month = months[date.getMonth()];
    const day = date.getDate();
    const hour = this.str_pad(date.getHours());
    const min = this.str_pad(date.getMinutes());
    const sec = this.str_pad(date.getSeconds());
    const time =
      day + " " + month + " " + year + " " + hour + ":" + min + ":" + sec;
    return time;
  }

  private str_pad(n: number) {
    return String("00" + n).slice(-2);
  }
}
</script>

<style scoped>
.blockchain__info h3 {
  margin: 0 0 15px;
  font-size: 20px;
  font-weight: 600;
}

.blockchain__container {
  display: flex;
  flex-wrap: wrap;
}
.blockchain__block__container {
  position: relative;
  width: 555px;
  margin-bottom: 10px;
}

.blockchain__block {
  width: 520px;
  border-radius: 5px;
  -webkit-box-shadow: 2px 4px 8px -2px rgba(119, 119, 119, 0.5);
  -moz-box-shadow: 2px 4px 8px -2px rgba(119, 119, 119, 0.5);
  box-shadow: 2px 4px 8px -2px rgba(119, 119, 119, 0.5);
}

.blockchain__block_title {
  display: flex;
  align-items: baseline;
  margin: 0;
  padding: 6px 25px;
  border-radius: 5px 5px 0 0;
  background-color: white;
}
.blockchain__block_title h4 {
  margin: 5px 0;
  color: #595959;
  font-size: 17px;
  font-weight: 600;
}
.blockchain__block_title span {
  margin-left: 10px;
  font-size: 9px;
  color: #9b9b9b;
}

.blockchain__block_first {
  display: flex;
  flex-direction: column;
  padding: 0px 25px 14px 25px;
  border-bottom: 1px solid #e4e7eb;
  background-color: white;
  font-size: 13px;
}

.block__info {
  display: flex;
  align-items: baseline;
  margin-bottom: 2px;
}
.block__info--prop {
  flex: 0 0 auto;
  font-weight: 500;
  color: #4e4f57;
  font-size: 12px;
}
.block__info--value {
  margin-left: 10px;
  font-size: 11px;
}
.block__info--value.valid {
  color: #52c41a;
}
.block__info--value.valid.background {
  padding: 0 10px;
  border: 1px solid #b7eb8f;
  border-radius: 5px;
  background-color: #f6ffed;
}
.block__info--value.nounce {
  color: #6b696f;
  font-size: 11px;
}

.blockchain__block_second {
  border-radius: 0 0 5px 5px;
  background-color: #e9ecf4;
}
.blockchain__block_second h4 {
  margin: 0;
  padding: 5px 25px;
  font-size: 13px;
  font-weight: 600;
  color: #595959;
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
  display: flex;
  align-items: center;
  color: #4a4a4a;
  font-size: 12px;
}
.block__transactions--addresses span {
  font-size: 15px;
  margin: 0 10px;
  font-weight: 700;
}
.block__transactions--amount {
  margin-left: 10px;
  color: #4e4f57;
  font-size: 15px;
  font-weight: 700;
}

.blockchain__arrow {
  position: absolute;
  width: 34px;
  top: 50%;
  right: 0;
  border-top: 3px solid #646464;
}
</style>
