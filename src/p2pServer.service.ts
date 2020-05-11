import WebSocket from "ws";

export default class P2pServerService {
  static connectToPeers(newPeers: string[]) {
    newPeers.forEach((peer: string) => {
      console.log(`Tying to connect to: ${peer}`);
      const ws = new WebSocket(peer);

      ws.on("open", () => console.log(`Successfully connected to ${peer}`));
      ws.on("error", () => {
        console.log(`Connection failed with ${peer}`);
      });
    });
  }
}
