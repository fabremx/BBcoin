import express from "express";
import * as bodyParser from "body-parser";
import Routes from "./routes";
import Websocket from "./sockets";
import { Block } from "./block";
import BlockchainService from "./blockchain.service";

class App {
  public blockchain: Block[] = [];
  public app: express.Application;
  public ws: Websocket = new Websocket();
  public routes: Routes = new Routes();

  constructor() {
    this.initBlockchain();
    this.app = express();
    this.config();
    this.routes.routes(this.app, this.ws, this.blockchain);
  }

  private config(): void {
    this.app.use(bodyParser.json());
  }

  private initBlockchain() {
    this.blockchain = [BlockchainService.getGenesisBlock()];
  }
}

export default new App().app;
