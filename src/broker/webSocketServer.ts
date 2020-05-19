import P2pServer from "../commons/p2pServer";
import { BROKER_WEBSOCKET_PORT } from "../config/env";
import WebSocket from "ws";

export class WebSocketServer extends P2pServer {
  constructor() {
    super(BROKER_WEBSOCKET_PORT);

    // When client connect to the broker
    this.server.on("connection", (ws: WebSocket, req: any) =>
      this.handleClientNode(ws, req)
    );
  }

  handleClientNode(ws: WebSocket, req: any) {
    this.addClientNode(ws, req);

    // Handle when client disconnect
    ws.on("close", () => {
      const clientNode: any = this.getNodeByWS(this.clientNodes, ws);
      this.deleteClientNode(clientNode);
    });
  }
}

export default new WebSocketServer();
