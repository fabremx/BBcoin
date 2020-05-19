import P2pServer from "../commons/p2pServer";
import { BROKER_WEBSOCKET_PORT, WEBSOCKET_URL_BASE } from "../config/env";
import WebSocket from "ws";
import Node from "../commons/Node";

declare var process: {
  env: {
    P2P_PORT: number;
  };
};

export class NodeServer extends P2pServer {
  nodesConnectedTo: Node[] = [];

  constructor() {
    super(process.env.P2P_PORT || 6001);

    // Connect to the broker server
    new WebSocket(
      `ws://localhost:${BROKER_WEBSOCKET_PORT}?nodePort=${this.P2P_PORT}`
    );

    // When someone connect to the server
    this.server.on("connection", (ws: WebSocket, req: any) => {
      this.handleNodeClient(ws);
      this.addNode(ws, req);
      // this.initConnection(ws)
    });
  }

  connectToPeers(peers: string[]) {
    const peersToConnect = this.removeUselessConnection(peers);

    peersToConnect.forEach((peerURL: string) => {
      console.log(`Tying to connect to: ${peerURL}`);

      const ws: WebSocket = new WebSocket(
        `${peerURL}?nodePort=${this.P2P_PORT}`
      );
      ws.on("open", () => {
        this.nodesConnectedTo.push(new Node(ws, peerURL));
        console.log(`Successfully connected to ${peerURL}`);
      });
      ws.on("error", () => console.log(`Connection failed with ${peerURL}`));
    });
  }

  // initConnection(ws: WebSocket): void {
  //   console.log(`Someone connected to the server`);

  //   ws.on("message", (data: string) => {
  //     var message = JSON.parse(data);
  //     console.log("Message Reçu" + JSON.stringify(message));
  //   });

  //   ws.on("close", () => this.closeConnection(ws));
  //   ws.on("error", () => this.closeConnection(ws));

  //   this.write(
  //     ws,
  //     "----------------------------------- Successfully connected to the P2P server"
  //   );
  // }

  // closeConnection(ws: WebSocket): void {
  //   console.log(`Closing the connection`);
  //   this.nodesClient.splice(this.nodesClient.indexOf(ws), 1);
  // }

  write(socket: WebSocket, message: any): void {
    socket.send(JSON.stringify(message));
  }

  broadcast(message: any): void {
    this.connectedNodes.forEach((node: Node) => this.write(node.ws, message));
  }

  getNodesConnectedToURL(): string[] {
    return this.nodesConnectedTo.map((ws: any) => ws.url);
  }

  private removeUselessConnection(peers: string[]): string[] {
    const peersWithoutMe = this.removeSelfUrlFrom(peers);
    const peersToConnect = this.removeNodesAlreadyConnected(peersWithoutMe);

    return peersToConnect;
  }

  private removeNodesAlreadyConnected(peers: string[]): string[] {
    const nodesConnectionURL = this.getNodesConnectedToURL();

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
}

export default new NodeServer();
