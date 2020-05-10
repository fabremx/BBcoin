import * as WebSocket from "ws";

export default class Websocket {
  P2P_PORT: number = 6002;
  server: any;
  sockets: WebSocket[] = [];

  constructor() {
    this.server = new WebSocket.Server({ port: this.P2P_PORT });
    this.server.on("connection", (ws: WebSocket) => this.initConnection(ws));
  }

  initConnection(ws: WebSocket) {
    this.sockets.push(ws);
  }

  connectToPeers(newPeers: WebSocket[]) {
    newPeers.forEach((peer: WebSocket) => {
      this.server.on("open", () => console.log("connexion ouverte"));
      this.server.on("error", () => {
        console.log("échec de la connexion");
      });
    });
  }

  write(socket: WebSocket, message: any) {
    socket.send(JSON.stringify(message));
  }

  broadcast(message: any) {
    this.sockets.forEach((socket) => this.write(socket, message));
  }
}
