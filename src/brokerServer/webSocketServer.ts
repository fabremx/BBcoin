import { BROKER_WEBSOCKET_PORT } from "./../config/env";
import * as WebSocket from "ws";
import Node from "../models/Node";

export class WebSocketServer {
  P2P_PORT: number = BROKER_WEBSOCKET_PORT;
  server: any;
  connectedNodes: Node[] = [];

  constructor() {
    this.server = new WebSocket.Server({ port: this.P2P_PORT });

    // When client connect to the broker
    this.server.on("connection", (ws: WebSocket, req: any) => {
      this.handleNodeClient(ws);
      this.addNode(ws, req);
    });

    console.log(`Listening P2P server on port : ${this.P2P_PORT}`);
  }

  handleNodeClient(websocket: WebSocket) {
    // Handle when client disconnect
    websocket.on("close", () => this.deleteNode(websocket));
  }

  addNode(websocket: WebSocket, req: any): void {
    const nodeUrl = this.getUrlFrom(req);
    console.log(`${nodeUrl} connected to the server`);

    if (this.connectedNodes.some((node: any) => node.url === nodeUrl)) {
      console.log("Node already in the connected list. Do nothing.");
      return;
    }

    console.log("Add new node to the connected list");
    this.connectedNodes.push(new Node(websocket, nodeUrl));
  }

  deleteNode(websocket: WebSocket): void {
    const nodeIndexToDelete = this.connectedNodes.findIndex(
      (node: any) => node.ws === websocket
    );

    if (nodeIndexToDelete < 0) {
      console.log("Node disconnected already deleted. Do nothing.");
      return;
    }

    console.log(
      `${this.connectedNodes[nodeIndexToDelete].url} disconnected to the server. Delete it.`
    );

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
