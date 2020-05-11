import { BROKER_HTTP_PORT } from "./../config/env";
import express from "express";
import * as bodyParser from "body-parser";

class HttpServer {
  public HTTP_PORT: number = BROKER_HTTP_PORT;
  public server!: express.Application;

  constructor() {
    this.server = express();
    this.server.use(bodyParser.json());

    this.server.listen(this.HTTP_PORT, () => {
      console.log(`Broker HTTP Server listening on port ${this.HTTP_PORT}`);
    });
  }
}

export default new HttpServer().server;
