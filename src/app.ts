import express from "express";
import p2pServer, { P2pServer } from "./p2pServer";
import WebSocketService from "./p2pServer.service";
import httpServer from "./httpServer";
import Routes from "./routes";

class App {
  public initialPeers = process.env.PEERS ? process.env.PEERS.split(",") : [];
  public httpServer!: express.Application;
  public p2pServer!: P2pServer;
  public httpRoutes!: Routes;

  constructor() {
    console.log("App constructor", this.initialPeers);
    WebSocketService.connectToPeers(this.initialPeers);
    this.initHttpServer();
    this.initP2PServer();
  }

  private initHttpServer(): void {
    this.httpServer = httpServer;
    this.httpRoutes = new Routes();
    this.httpRoutes.routes();
  }

  private initP2PServer() {
    this.p2pServer = p2pServer;
  }
}

new App();
