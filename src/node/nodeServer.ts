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
  serverNodes: Node[] = [];

  constructor() {
    super(process.env.P2P_PORT || 6001);
    this.handleBrokerConnection();

    // When someone connect to the server
    this.server.on("connection", (ws: WebSocket, req: any) =>
      this.handleClientNode(ws, req)
    );
  }

  handleBrokerConnection() {
    // Connect to the broker server
    const brokerWs = new WebSocket(
      `ws://localhost:${BROKER_WEBSOCKET_PORT}?nodePort=${this.P2P_PORT}`
    );

    brokerWs.on("close", () => {
      console.log("connexion with the broker interrupted. Closing the node...");
      global.process.exit(1);
    });
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
    ws.on("close", () => {
      const nodes = this.getClientAndServerNodeFrom(ws);

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
  }

  deleteServerNode(serverNode: Node): void {
    if (!serverNode) return;

    this.serverNodes.splice(this.serverNodes.indexOf(serverNode), 1);
    console.log(`\n${serverNode.url} successfully removed from servers list`);
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
    this.clientNodes.forEach((node: Node) => this.write(node.ws, message));
  }

  getNodesConnectedToURL(): string[] {
    return this.serverNodes.map((ws: any) => ws.url);
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

  private getClientAndServerNodeFrom(ws: WebSocket): any {
    const client: Node | null = this.getNodeByWS(this.clientNodes, ws);
    const server: Node | null = this.getNodeByURL(
      this.serverNodes,
      client && client.url
    );

    return {
      client,
      server,
    };
  }
}

export default new NodeServer();
