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

    this.server.on("close", (_ws: WebSocket, req: any) => {
      this.deleteNode(req);
    });

    console.log(`Listening P2P server on port : ${this.P2P_PORT}`);
  }

  addNode(websocket: WebSocket, req: any): void {
    const nodeUrl = this.getUrlFrom(req);
    console.log(`${nodeUrl} connected to the server`);

    if (this.connectedNodes.some((node: any) => node.url === nodeUrl)) {
      console.log("Node already in the connected list. Do nothing.");
      return;
    }

    console.log("Add new node to the connected list");
    this.connectedNodes.push({
      ws: websocket,
      url: nodeUrl,
    });
  }

  deleteNode(req: any): void {
    const nodeUrl = this.getUrlFrom(req);
    console.log(`${nodeUrl} disconnected to the server`);

    const nodeIndexToDelete = this.connectedNodes.findIndex(
      (node: any) => node.url === nodeUrl
    );

    if (nodeIndexToDelete < 0) {
      console.log("Node already deleted. Do nothing.");
      return;
    }

    console.log("Delete node.");
    this.connectedNodes.splice(nodeIndexToDelete, 1);
  }

  private getUrlFrom(req: any): string {
    const nodePort = req.url.split("=")[1];
    return `ws://localhost:${nodePort}`;
  }

  getConnectedNodesURL() {
    return this.connectedNodes.map((ws: any) => ws.url);
  }
}

export default new WebSocketServer();
