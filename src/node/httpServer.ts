import HttpServer from "../commons/httpServer";
import NodeServer from "../node/nodeServer";
import Blockchain from "../commons/blockchain";

declare var process: {
  env: {
    HTTP_PORT: number;
  };
};

class NodeHttpServer extends HttpServer {
  constructor() {
    super(process.env.HTTP_PORT || 3001);
    this.setNodeRoutes();
  }

  setNodeRoutes(): void {
    this.server.get("/blocks", (req, res) => {
      res.status(200).send(JSON.stringify(Blockchain.blockchain));
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
      var newBlock = Blockchain.generateNextBlock(req.body.data);

      //   this.blockchainService.addBlock(newBlock);

      NodeServer.broadcast("message");

      console.log("block ajouté : " + JSON.stringify(newBlock));
      res.send();
    });
  }
}

export default new NodeHttpServer().server;
