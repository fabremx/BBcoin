import WebSocket from "ws";
import Node from "./Node";

export default class P2pServer {
  P2P_PORT!: number;
  server!: WebSocket.Server;
  clientNodes: Node[] = [];

  constructor(P2P_PORT: number) {
    this.P2P_PORT = P2P_PORT;
    this.server = new WebSocket.Server({ port: this.P2P_PORT });
    console.log(`Listening P2P server on port : ${this.P2P_PORT}`);
  }

  addClientNode(websocket: WebSocket, req: any): void {
    const nodeUrl = this.getUrlFrom(req);
    console.log(`\nClient ${nodeUrl} connected to the server`);

    if (this.clientNodes.some((node: any) => node.url === nodeUrl)) {
      console.log("Node already in the connected list. Do nothing.");
      return;
    }

    this.clientNodes.push(new Node(websocket, nodeUrl));
    console.log(`Client ${nodeUrl} successfully added to the clients list.`);
  }

  deleteClientNode(clientNode: Node | null): void {
    if (!clientNode) return;

    const index = this.clientNodes.findIndex(
      (node: Node) => node.ws === clientNode.ws
    );
    this.clientNodes.splice(index, 1);
    console.log(`\n${clientNode.url} successfully removed from clients list.`);
  }

  getConnectedNodesURL() {
    return this.clientNodes.map((ws: any) => ws.url);
  }

  getNodeByWS(nodes: Node[], ws: WebSocket): Node | null {
    const index = nodes.findIndex((node: Node) => node.ws === ws);
    return index < 0 ? null : nodes[index];
  }

  getNodeByURL(nodes: Node[], peerURL: string | null): Node | null {
    const index = nodes.findIndex((node: Node) => node.url === peerURL);
    return index < 0 ? null : nodes[index];
  }

  private getUrlFrom(req: any): string {
    const nodePort = req.url.split("=")[1];
    return `ws://localhost:${nodePort}`;
  }
}
