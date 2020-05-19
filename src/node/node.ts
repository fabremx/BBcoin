import {
  BROKER_HTTP_PORT,
  HTTP_URL_BASE,
  INTERVAL_RETRIEVE_PEERS,
} from "../config/env";
import express from "express";
import nodeServer, { NodeServer } from "./nodeServer";
import httpServer from "./httpServer";
import fetch from "node-fetch";

class Node {
  public httpServer!: express.Application;
  public nodeServer!: NodeServer;

  public launch() {
    this.initHttpServer();
    this.initP2PServer();
  }

  private async getPeers(): Promise<string[]> {
    try {
      const response = await fetch(
        `${HTTP_URL_BASE}:${BROKER_HTTP_PORT}/getNodes`
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
    this.nodeServer = nodeServer;

    setInterval(async () => {
      console.log("\nlooking for peers...");
      const peers: string[] = await this.getPeers();

      console.log("All peers connected: ", peers, "\n");
      this.nodeServer.connectToPeers(peers);
    }, INTERVAL_RETRIEVE_PEERS);
  }
}

new Node().launch();
