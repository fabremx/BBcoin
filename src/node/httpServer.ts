import HttpServer from "../commons/httpServer";
import BlockchainService from "../node/blockchain.service";
import NodeServer from "../node/nodeServer";
import blockchain from "../commons/blockchain";

declare var process: {
  env: {
    HTTP_PORT: number;
  };
};

class NodeHttpServer extends HttpServer {
  blockchainService: BlockchainService = new BlockchainService();

  constructor() {
    super(process.env.HTTP_PORT || 3001);
    this.setNodeRoutes();
  }

  setNodeRoutes(): void {
    this.server.get("/blocks", (req, res) => {
      res.status(200).send(JSON.stringify(blockchain));
    });

    this.server.get("/peers", (req, res) => {
      const connectedNodes = NodeServer.getConnectedNodesURL();
      res.status(200).send(JSON.stringify(connectedNodes));
    });

    this.server.get("/connectedTo", (req, res) => {
      const nodesConnectedTo = NodeServer.getNodesConnectedToURL();
      res.status(200).send(JSON.stringify(nodesConnectedTo));
    });

    this.server.post("/mineBlock", (req, res) => {
      var newBlock = this.blockchainService.generateNextBlock(
        blockchain,
        req.body.data
      );

      //   this.blockchainService.addBlock(newBlock);

      NodeServer.broadcast("message");

      console.log("block ajouté : " + JSON.stringify(newBlock));
      res.send();
    });
  }
}

export default new NodeHttpServer().server;
