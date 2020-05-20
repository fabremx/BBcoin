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
    this.server.get("/infos", (req, res) => {
      const nodeInfo = {
        clients: NodeServer.getClientNodesURL(),
        servers: NodeServer.getServerNodesRL(),
        Blockchain: Blockchain.blockchain,
      };
      res.status(200).send(JSON.stringify(nodeInfo));
    });

    this.server.post("/addBlock", (req, res) => {
      const newBlock = Blockchain.generateNextBlock(req.body.data);
      //   this.blockchainService.addBlock(newBlock);

      NodeServer.broadcast("message");

      console.log("block ajouté : " + JSON.stringify(newBlock));
      res.send();
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
