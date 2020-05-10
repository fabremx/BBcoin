import express from "express";
import { Block } from "./block";
import BlockchainService from "./blockchain.service";
import Websocket from "./sockets";

export default class Routes {
  public blockchainService: BlockchainService = new BlockchainService();

  public routes(
    app: express.Application,
    websocketServer: Websocket,
    blockchain: Block[]
  ): void {
    app.get("/blocks", (req, res) => {
      res.send(JSON.stringify(blockchain));
    });

    app.post("/mineBlock", (req, res) => {
      var newBlock = this.blockchainService.generateNextBlock(
        blockchain,
        req.body.data
      );

      //   this.blockchainService.addBlock(newBlock);

      websocketServer.broadcast("message");

      console.log("block ajouté : " + JSON.stringify(newBlock));
      res.send();
    });

    app.get("/peers", (req, res) => {
      res.send(
        websocketServer.sockets.map(
          (s: any) => s._socket.remoteAddress + ":" + s._socket.remotePort
        )
      );
    });

    app.post("/addPeer", (req, res) => {
      websocketServer.connectToPeers([req.body.peer]);
      res.send();
    });
  }
}
