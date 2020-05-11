import { BROKER_WEBSOCKET_PORT } from "./../config/env";
import * as WebSocket from "ws";

export class WebSocketServer {
  P2P_PORT: number = BROKER_WEBSOCKET_PORT;
  server: any;
  connectedNodes: object[] = [];

  constructor() {
    this.server = new WebSocket.Server({ port: this.P2P_PORT });
    this.server.on("connection", (ws: WebSocket, req: any) =>
      this.addNode(ws, req)
    );

    console.log(`Listening P2P server on port : ${this.P2P_PORT}`);
  }

  addNode(websocket: WebSocket, req: any): void {
    const nodePort = req.url.split("=")[1];
    const nodeUrl = `ws://localhost:${nodePort}`;

    console.log(`${nodeUrl} connected to the server`);
    if (this.connectedNodes.some((node: any) => node.url === nodeUrl)) {
      return;
    }

    this.connectedNodes.push({
      ws: websocket,
      url: nodeUrl,
    });
  }

  deleteNode(nodeUrl: string): void {
    console.log(`${nodeUrl} disconnected to the server`);

    const nodeIndexToDelete = this.connectedNodes.findIndex(
      (node: any) => node.url === nodeUrl
    );
    if (nodeIndexToDelete < 0) {
      return;
    }

    this.connectedNodes.splice(nodeIndexToDelete, 1);
  }
}

export default new WebSocketServer();
