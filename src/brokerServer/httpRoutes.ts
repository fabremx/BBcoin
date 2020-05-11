import webScoketServer from "./webSocketServer";
import httpServer from "./httpServer";

export default class HttpRoutes {
  public routes(): void {
    httpServer.get("/getNodes", (req, res) => {
      console.log("GET");
      const connectedNodes = webScoketServer.connectedNodes;
      res.status(200).send(JSON.stringify({ peers: connectedNodes }));
    });
  }
}
