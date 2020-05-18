import { BROKER_WEBSOCKET_PORT, WEBSOCKET_URL_BASE } from "./config/env";
import WebSocket from "ws";
import Node from "./models/Node";

declare var process: {
  env: {
    P2P_PORT: number;
  };
};

export class P2pServer {
  P2P_PORT: number = process.env.P2P_PORT || 6001;
  server: any;
  connectedTo: Node[] = [];
  nodesClient: WebSocket[] = [];

  constructor() {
    // Connect to the broker server
    new WebSocket(
      `ws://localhost:${BROKER_WEBSOCKET_PORT}?nodePort=${this.P2P_PORT}`
    );

    // Create Node Server
    this.server = new WebSocket.Server({ port: this.P2P_PORT });

    // When someone connect to the server
    this.server.on("connection", (ws: WebSocket) => this.initConnection(ws));
    console.log(`Listening P2P server on port : ${this.P2P_PORT}`);
  }

  connectToPeers(peers: string[]) {
    const peersToConnect = this.removeUselessConnection(peers);

    peersToConnect.forEach((peer: string) => {
      console.log(`Tying to connect to: ${peer}`);

      const ws: WebSocket = new WebSocket(peer);
      this.connectedTo.push(new Node(ws, peer));

      ws.on("open", () => console.log(`Successfully connected to ${peer}`));
      ws.on("error", (a: any, b: any) => {
        console.log("---------------------", a, b);
        console.log(`Connection failed with ${peer}`);
      });
    });
  }

  initConnection(ws: WebSocket): void {
    console.log(`Someone connected to the server`);

    this.nodesClient.push(ws);

    // ws.on("message", (data: string) => {
    //   var message = JSON.parse(data);
    //   console.log("Message Reçu" + JSON.stringify(message));
    // });

    // ws.on("close", () => this.closeConnection(ws));
    // ws.on("error", () => this.closeConnection(ws));

    this.write(ws, "Successfully connected to the P2P server");
  }

  closeConnection(ws: WebSocket): void {
    console.log(`Closing the connection`);
    this.nodesClient.splice(this.nodesClient.indexOf(ws), 1);
  }

  write(socket: WebSocket, message: any): void {
    socket.send(JSON.stringify(message));
  }

  broadcast(message: any): void {
    this.nodesClient.forEach((socket) => this.write(socket, message));
  }

  private removeUselessConnection(peers: string[]): string[] {
    const peersWithoutMe = this.removeSelfUrlFrom(peers);
    const peersToConnect = this.removeNodesAlreadyConnected(peersWithoutMe);

    return peersToConnect;
  }

  private removeNodesAlreadyConnected(peers: string[]): string[] {
    const nodesConnectionURL = this.getNodesConnectionsURL(this.connectedTo);

    return peers.filter((x) => !nodesConnectionURL.includes(x));
  }

  private removeSelfUrlFrom(peers: string[]): string[] {
    const peersTemp = peers;
    const index = peers.indexOf(
      `${WEBSOCKET_URL_BASE}:${this.P2P_PORT}`.trim()
    );

    if (index < 0) return peers;

    peersTemp.splice(index, 1);
    return peersTemp;
  }

  getNodesConnectionsURL(peers: Node[]): string[] {
    return peers.map((node: Node) => node.url);
  }
}

export default new P2pServer();
