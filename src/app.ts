import { BROKER_HTTP_PORT } from "./config/env";
import express from "express";
import p2pServer, { P2pServer } from "./p2pServer";
import * as p2pUtils from "./p2p.utils";
import httpServer from "./httpServer";
import fetch from "node-fetch";

class App {
  public httpServer!: express.Application;
  public p2pServer!: P2pServer;

  public async launch() {
    this.initHttpServer();
    this.initP2PServer();

    const peers: string[] = await this.getPeers();
    p2pUtils.connectToPeers(peers);
  }

  private async getPeers(): Promise<string[]> {
    console.log("retrieved other peers...");

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
  }
}

new App().launch();
