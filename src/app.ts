import { BROKER_HTTP_PORT } from "./config/env";
import express from "express";
import p2pServer, { P2pServer } from "./p2pServer";
import WebSocketService from "./p2pServer.service";
import httpServer from "./httpServer";
import Routes from "./routes";
import fetch from "node-fetch";

class App {
  public initialPeers = process.env.PEERS ? process.env.PEERS.split(",") : [];
  public httpServer!: express.Application;
  public p2pServer!: P2pServer;
  public httpRoutes!: Routes;

  public async launch() {
    await this.getPeers();
    // WebSocketService.connectToPeers(this.initialPeers);

    this.initHttpServer();
    this.initP2PServer();
  }

  private async getPeers() {
    const brokerUrl = `http://localhost:${BROKER_HTTP_PORT}/getNodes`;
    const requestOptions = {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "applications/json",
      },
    };

    try {
      console.log("call endpoint: ", brokerUrl);
      const response = await fetch(brokerUrl, requestOptions);
      console.log("response", response);
      const peers = await response.json();

      console.log("peers", peers);
    } catch (error) {
      console.log(error);
    }
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

new App().launch();
