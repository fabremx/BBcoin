import { BROKER_HTTP_PORT } from "./config/env";
import express from "express";
import p2pServer, { P2pServer } from "./p2pServer";
import httpServer from "./httpServer";
import fetch from "node-fetch";

class App {
  public httpServer!: express.Application;
  public p2pServer!: P2pServer;

  public launch() {
    this.initHttpServer();
    this.initP2PServer();
  }

  private async getPeers(): Promise<string[]> {
    try {
      const response = await fetch(
        `http://localhost:${BROKER_HTTP_PORT}/getNodes`
      );

      const result = await response.json();
      return result.peers || [];
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  private initHttpServer(): void {
    this.httpServer = httpServer;
  }

  private initP2PServer() {
    this.p2pServer = p2pServer;

    setInterval(async () => {
      console.log("\nlooking for peers...");
      const peers: string[] = await this.getPeers();

      console.log("All peers connected: ", peers);
      this.p2pServer.connectToPeers(peers);
    }, 5000);
  }
}

new App().launch();
