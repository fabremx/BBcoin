import express from "express";
import webSocketServer, { WebSocketServer } from "./webSocketServer";
import httpServer from "./httpServer";
import HttpRoutes from "./httpRoutes";

class BrokerServer {
  public httpServer!: express.Application;
  public webSocketServer!: WebSocketServer;
  public httpRoutes!: HttpRoutes;

  constructor() {
    this.initHttpServer();
    this.iniWebSocketServer();
  }

  private initHttpServer(): void {
    this.httpServer = httpServer;
    this.httpRoutes = new HttpRoutes();
    this.httpRoutes.routes();
  }

  private iniWebSocketServer() {
    this.webSocketServer = webSocketServer;
  }
}

new BrokerServer();
