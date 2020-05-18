import { BROKER_WEBSOCKET_PORT } from "./config/env";
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
    // Connect to the broker server
    new WebSocket.default(
      `ws://localhost:${BROKER_WEBSOCKET_PORT}?nodePort=${this.P2P_PORT}`
    );

    // Create Node Server
    this.server = new WebSocket.Server({ port: this.P2P_PORT });

    // When someone connect to the server
    this.server.on("connection", (ws: WebSocket) => this.initConnection(ws));
    console.log(`Listening P2P server on port : ${this.P2P_PORT}`);
  }

  initConnection(ws: WebSocket): void {
    console.log(`Someone connected to the server`);

    this.sockets.push(ws);

    ws.on("message", (data: string) => {
      var message = JSON.parse(data);
      console.log("Message Reçu" + JSON.stringify(message));
    });

    ws.on("close", () => this.closeConnection(ws));
    ws.on("error", () => this.closeConnection(ws));

    this.write(ws, "Successfully connected to the P2P server");
  }

  closeConnection(ws: WebSocket): void {
    console.log(`Closing the connection`);
    this.sockets.splice(this.sockets.indexOf(ws), 1);
  }

  write(socket: WebSocket, message: any): void {
    socket.send(JSON.stringify(message));
  }

  broadcast(message: any): void {
    this.sockets.forEach((socket) => this.write(socket, message));
  }
}

export default new P2pServer();
