import express from "express";
import BlockchainService from "./blockchain.service";
import P2pServer from "./p2pServer";
import * as p2pUtils from "./p2p.utils";
import blockchain from "./models/blockchain";

export default class Routes {
  static setRoutes(server: express.Application): void {
    const blockchainService: BlockchainService = new BlockchainService();

    server.get("/blocks", (req, res) => {
      res.status(200).send(JSON.stringify(blockchain));
    });

    server.get("/connectedTo", (req, res) => {
      const connectedTo = P2pServer.getNodesConnectionsURL(
        P2pServer.connectedTo
      );
      res.status(200).send(JSON.stringify(connectedTo));
    });

    server.post("/mineBlock", (req, res) => {
      var newBlock = blockchainService.generateNextBlock(
        blockchain,
        req.body.data
      );

      //   this.blockchainService.addBlock(newBlock);

      P2pServer.broadcast("message");

      console.log("block ajouté : " + JSON.stringify(newBlock));
      res.send();
    });

    server.get("/peers", (req, res) => {
      res.send(
        P2pServer.connectedTo.map(
          (s: any) => s.ws._socket.remoteAddress + ":" + s.ws._socket.remotePort
        )
      );
    });
  }
}
