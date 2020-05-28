import HttpServer from "../commons/httpServer";
import NodeServer from "../node/nodeServer";
import Blockchain from "../commons/blockchain";
import { Transaction } from "../commons/transaction";

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
        servers: NodeServer.getServerNodesRL()
      };

      res.status(200).send(JSON.stringify(nodeInfo));
    });

    this.server.get("/blockchain", (req, res) => {
      res.status(200).send(JSON.stringify(Blockchain.blockchain));
    });

    this.server.get("/wallet/:walletId", (req, res) => {
      const walletId = req.params.id;
      const amountWAllet = Blockchain.getBalanceOfAddress(walletId);

      res.status(200).send(JSON.stringify(amountWAllet));
    });

    this.server.post("/addTransaction", (req, res) => {
      const { transaction } = req.body;

      try {
        Blockchain.addTransaction(transaction);
      } catch (error) {
        res.send(error);
      }

      NodeServer.broadcast(transaction);
      res.send();
    });
  }
}

export default new NodeHttpServer().server;
