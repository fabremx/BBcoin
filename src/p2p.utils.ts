import WebSocket from "ws";
import p2pServer from "./p2pServer";
import { WEBSOCKET_URL_BASE } from "./config/env";

export function connectToPeers(peers: string[]) {
  const peersToConnect = removeSelfUrlFrom(peers);

  peersToConnect.forEach((peer: string) => {
    console.log(`Tying to connect to: ${peer}`);
    const ws = new WebSocket(peer);

    ws.on("open", () => console.log(`Successfully connected to ${peer}`));
    ws.on("error", () => {
      console.log(`Connection failed with ${peer}`);
    });
  });
}

function removeSelfUrlFrom(peers: string[]): string[] {
  const peersTemp = peers;
  const index = peers.indexOf(`${WEBSOCKET_URL_BASE}:${p2pServer.P2P_PORT}`);

  if (index < 0) return peers;

  peersTemp.splice(index, 1);
  return peersTemp;
}
