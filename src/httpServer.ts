import express from "express";
import * as bodyParser from "body-parser";

declare var process: {
  env: {
    HTTP_PORT: number;
  };
};

class HttpServer {
  public HTTP_PORT: number = process.env["HTTP_PORT"] || 3001;
  public server!: express.Application;

  constructor() {
    this.server = express();
    this.server.use(bodyParser.json());

    this.server.listen(this.HTTP_PORT, () => {
      console.log(`HTTP Server listening on port ${this.HTTP_PORT}`);
    });
  }
}

export default new HttpServer().server;
