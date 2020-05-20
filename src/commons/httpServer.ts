import { BROKER_HTTP_PORT } from "../config/env";
import express from "express";
import cors from "cors";
import * as bodyParser from "body-parser";

export default class HttpServer {
  public HTTP_PORT: number = BROKER_HTTP_PORT;
  public server!: express.Application;

  constructor(HTTP_PORT: number) {
    this.HTTP_PORT = HTTP_PORT;
    this.server = express();
    this.server.use(bodyParser.json());
    this.server.use(cors());

    this.server.listen(this.HTTP_PORT, () => {
      console.log(`Broker HTTP Server listening on port ${this.HTTP_PORT}`);
    });
  }
}
