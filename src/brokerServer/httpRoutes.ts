import express from "express";
import webScoketServer from "./webSocketServer";

export default class HttpRoutes {
  static setRoutes(server: express.Application): void {
    server.get("/getNodes", (req, res) => {
      const wsUrlConnected = webScoketServer.getConnectedNodesURL();
      res.status(200).send(JSON.stringify({ peers: wsUrlConnected }));
    });
  }
}
