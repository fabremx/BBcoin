import P2pServer from "../commons/p2pServer";
import { BROKER_WEBSOCKET_PORT, WEBSOCKET_URL_BASE } from "../constants/urls";
import WebSocket from "ws";
import Node from "../commons/Node";
import Message from "../commons/message";
import {
  NEW_TRANSACTION_MESSAGE,
  NEW_BLOCK_ADDED_MESSAGE
} from "../constants/messageTypes";
import Blockchain from "../commons/blockchain";

declare var process: {
  env: {
    P2P_PORT: number;
  };
};

export class NodeServer extends P2pServer {
  serverNodes: Node[] = [];

  constructor() {
    super(process.env.P2P_PORT || 6001);

    // Connect to the broker server
    new WebSocket(
      `ws://localhost:${BROKER_WEBSOCKET_PORT}?nodePort=${this.P2P_PORT}`
    );

    // When someone connect to the server
    this.server.on("connection", (ws: WebSocket, req: any) =>
      this.handleClientNode(ws, req)
    );
  }

  connectToPeers(peers: string[]) {
    const peersToConnect = this.removeUselessConnection(peers);

    peersToConnect.forEach((peerURL: string) => {
      console.log(`Tying to connect to: ${peerURL} ...`);

      const ws: WebSocket = new WebSocket(
        `${peerURL}?nodePort=${this.P2P_PORT}`
      );

      this.handleServerNode(ws, peerURL);
    });
  }

  handleClientNode(ws: WebSocket, req: any) {
    this.addClientNode(ws, req);

    // Handle when client disconnect
    const nodes = this.getClientAndServerNodeFrom(ws);

    ws.on("close", () => {
      console.log(`\nClient ${nodes.client.url} disconnected\n`);

      this.deleteClientNode(nodes.client);
      this.deleteServerNode(nodes.server);
    });
  }

  handleServerNode(ws: WebSocket, peerURL: string): void {
    ws.on("open", () => {
      this.serverNodes.push(new Node(ws, peerURL));
      console.log(
        `Connection succeed: ${peerURL} successfully added to the server list.`
      );
    });

    ws.on("error", () => console.log(`Connection failed with ${peerURL}`));

    ws.on("message", (message: Message) => {
      console.log(`\Message received from ${peerURL} : ${message}\n`);
      this.handleMessageReceived(message);
    });
  }

  handleMessageReceived(message: Message) {
    switch (message.type) {
      case NEW_TRANSACTION_MESSAGE:
        Blockchain.addTransaction(message.transaction);
        Blockchain.minePendingTransactions("test");
      case NEW_BLOCK_ADDED_MESSAGE:
        break;
      default:
        break;
    }
  }

  deleteServerNode(serverNode: Node): void {
    if (!serverNode) return;

    this.serverNodes.splice(this.serverNodes.indexOf(serverNode), 1);
    console.log(`\n${serverNode.url} successfully removed from servers list`);
  }

  write(socket: WebSocket, message: any): void {
    socket.send(JSON.stringify(message));
  }

  broadcast(message: any): void {
    this.clientNodes.forEach((node: Node) => this.write(node.ws, message));
  }

  getServerNodesRL(): string[] {
    return this.serverNodes.map((ws: any) => ws.url);
  }

  private removeUselessConnection(peers: string[]): string[] {
    const peersWithoutMe = this.removeSelfUrlFrom(peers);
    const peersToConnect = this.removeNodesAlreadyConnected(peersWithoutMe);

    return peersToConnect;
  }

  private removeNodesAlreadyConnected(peers: string[]): string[] {
    const nodesConnectionURL = this.getServerNodesRL();

    return peers.filter(x => !nodesConnectionURL.includes(x));
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

  private getClientAndServerNodeFrom(ws: WebSocket): any {
    const client: Node | null = this.getNodeByWS(this.clientNodes, ws);
    const server: Node | null = this.getNodeByURL(
      this.serverNodes,
      client && client.url
    );

    return {
      client,
      server
    };
  }
}

export default new NodeServer();
