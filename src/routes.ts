import BlockchainService from "./blockchain.service";
import P2pServer from "./p2pServer";
import P2pServerService from "./p2pServer.service";
import httpServer from "./httpServer";
import blockchain from "./blockchain";

export default class Routes {
  public blockchainService: BlockchainService = new BlockchainService();

  public routes(): void {
    httpServer.get("/blocks", (req, res) => {
      res.status(200).send(JSON.stringify(blockchain));
    });

    httpServer.post("/mineBlock", (req, res) => {
      var newBlock = this.blockchainService.generateNextBlock(
        blockchain,
        req.body.data
      );

      //   this.blockchainService.addBlock(newBlock);

      P2pServer.broadcast("message");

      console.log("block ajouté : " + JSON.stringify(newBlock));
      res.send();
    });

    httpServer.get("/peers", (req, res) => {
      res.send(
        P2pServer.sockets.map(
          (s: any) => s._socket.remoteAddress + ":" + s._socket.remotePort
        )
      );
    });

    httpServer.post("/addPeer", (req, res) => {
      P2pServerService.connectToPeers([req.body.peer]);
      res.send();
    });
  }
}
