import WebSocket from "ws";

export default class Node {
  ws: WebSocket;
  url: string;

  constructor(ws: WebSocket, url: string) {
    this.ws = ws;
    this.url = url;
  }
}
