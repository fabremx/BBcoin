import * as WebSocket from "ws";

declare var process: {
  env: {
    P2P_PORT: number;
  };
};

export class P2pServer {
  P2P_PORT: number = process.env.P2P_PORT || 6001;
  server: any;
  sockets: WebSocket[] = [];

  constructor() {
    this.server = new WebSocket.Server({ port: this.P2P_PORT });
    // When someone connect to the server
    this.server.on("connection", (ws: WebSocket) => this.initConnection(ws));
  }

  initConnection(ws: WebSocket) {
    this.sockets.push(ws);

    this.server.on("message", (data: string) => {
      var message = JSON.parse(data);
      console.log("Message Reçu" + JSON.stringify(message));
    });
  }

  write(socket: WebSocket, message: any) {
    socket.send(JSON.stringify(message));
  }

  broadcast(message: any) {
    this.sockets.forEach((socket) => this.write(socket, message));
  }
}

export default new P2pServer();
