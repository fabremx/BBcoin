import BlockchainService from "../node/blockchain.service";
import { Block } from "./block";

export class Blockchain {
  public blockchain: Block[] = [BlockchainService.getGenesisBlock()];
}

export default new Blockchain().blockchain;
