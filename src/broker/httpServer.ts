import HttpServer from "../commons/httpServer";
import { BROKER_HTTP_PORT } from "../constants/urls";
import webScoketServer from "./webSocketServer";

class BrokerHttpServer extends HttpServer {
  constructor() {
    super(BROKER_HTTP_PORT);
    this.setBorkerRoutes();
  }

  setBorkerRoutes(): void {
    this.server.get("/getNodes", (req, res) => {
      const wsUrlConnected = webScoketServer.getClientNodesURL();
      res.status(200).send(JSON.stringify({ peers: wsUrlConnected }));
    });
  }
}

export default new BrokerHttpServer().server;
