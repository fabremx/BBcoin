import express from "express";
import webSocketServer, { WebSocketServer } from "./webSocketServer";
import httpServer from "./httpServer";

class BrokerServer {
  public httpServer!: express.Application;
  public webSocketServer!: WebSocketServer;

  constructor() {
    this.initHttpServer();
    this.iniWebSocketServer();
  }

  private initHttpServer(): void {
    this.httpServer = httpServer;
  }

  private iniWebSocketServer() {
    this.webSocketServer = webSocketServer;
  }
}

new BrokerServer();
