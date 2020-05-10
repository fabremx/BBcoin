import WebSocket from "ws";

export default class P2pServerService {
  static connectToPeers(newPeers: string[]) {
    newPeers.forEach((peer: string) => {
      const ws = new WebSocket(peer);

      ws.on("open", () => console.log("connexion ouverte"));
      ws.on("error", () => {
        console.log("échec de la connexion");
      });
    });
  }
}
