import P2pServer from "./p2pServer";
jest.spyOn(console, "error").mockImplementation();
jest.spyOn(console, "log").mockImplementation();

import Node from "../commons/Node";

const PORT = 6000;
const p2pServer: P2pServer = new P2pServer(PORT);

jest.mock("ws");

describe("P2p Server Class", () => {
  describe("addClientNode", () => {
    it("should add the connected node when new node connect", () => {
      // Given
      const ws = "node1";
      const req = {
        url: "/?nodePort=6001",
      };

      // When
      // @ts-ignore
      p2pServer.addClientNode(ws, req);

      // Then
      const expectedResult = [{ ws: "node1", url: "ws://localhost:6001" }];
      expect(p2pServer.clientNodes).toEqual(expectedResult);
    });

    it("should NOT add the connected node when the same node connect but is already registered", () => {
      // Given

      p2pServer.clientNodes = [
        // @ts-ignore
        new Node("node1", "ws://localhost:6001"),
        // @ts-ignore
        new Node("node2", "ws://localhost:6002"),
      ];

      const ws = "node1";
      const req = {
        url: "/?nodePort=6001",
      };

      // When
      // @ts-ignore
      p2pServer.addClientNode(ws, req);

      // Then
      const expectedResult = [
        { ws: "node1", url: "ws://localhost:6001" },
        { ws: "node2", url: "ws://localhost:6002" },
      ];
      expect(p2pServer.clientNodes).toEqual(expectedResult);
    });
  });

  describe("deleteClientNode", () => {
    it("should delete node when node disconnect", () => {
      // Given
      p2pServer.clientNodes = [
        // @ts-ignore
        new Node("node1", "ws://localhost:6001"),
        // @ts-ignore
        new Node("node2", "ws://localhost:6002"),
        // @ts-ignore
        new Node("node3", "ws://localhost:6003"),
      ];

      // @ts-ignore
      const nodetoDelete = new Node("node2", "ws://localhost:6002");

      // When
      // @ts-ignore
      p2pServer.deleteClientNode(nodetoDelete);

      // Then
      const expectedResult = [
        { ws: "node1", url: "ws://localhost:6001" },
        { ws: "node3", url: "ws://localhost:6003" },
      ];
      expect(p2pServer.clientNodes).toEqual(expectedResult);
    });

    it("should do nothing when the node to delete is null", () => {
      // Given
      p2pServer.clientNodes = [
        // @ts-ignore
        new Node("node1", "ws://localhost:6001"),
        // @ts-ignore
        new Node("node3", "ws://localhost:6003"),
      ];

      // @ts-ignore
      const nodetoDelete = null;

      // When
      // @ts-ignore
      p2pServer.deleteClientNode(nodetoDelete);

      // Then
      const expectedResult = [
        { ws: "node1", url: "ws://localhost:6001" },
        { ws: "node3", url: "ws://localhost:6003" },
      ];
      expect(p2pServer.clientNodes).toEqual(expectedResult);
    });
  });

  describe("getConnectedNodesURL", () => {
    it("should return empty array when connectedNodes is empty", () => {
      // Given
      const connectedNodes = (p2pServer.clientNodes = [
        // @ts-ignore
        new Node("node1", "ws://localhost:6001"),
        // @ts-ignore
        new Node("node3", "ws://localhost:6003"),
      ]);

      // Given
      const result = p2pServer.getConnectedNodesURL();

      // Then
      const expectedResult = ["ws://localhost:6001", "ws://localhost:6003"];
      expect(result).toEqual(expectedResult);
    });

    it("should return only url in an array when connectedNodes is NOT empty", () => {
      // Given
      const connectedNodes = (p2pServer.clientNodes = []);

      // Given
      const result = p2pServer.getConnectedNodesURL();

      // Then
      expect(result).toEqual([]);
    });
  });

  describe("getNodeByWS", () => {
    it("should return node when nodes list contain the looked for websocket", () => {
      // Given
      const nodeList = [
        // @ts-ignore
        new Node("node1", "ws://localhost:6001"),
        // @ts-ignore
        new Node("node2", "ws://localhost:6002"),
      ];

      const ws = "node2";

      // When
      // @ts-ignore
      const result = p2pServer.getNodeByWS(nodeList, ws);

      // Then
      // @ts-ignore
      expect(result).toEqual(new Node("node2", "ws://localhost:6002"));
    });

    it("should return null when nodes list does NOT contain the looked for websocket", () => {
      // Given
      const nodeList = [
        // @ts-ignore
        new Node("node1", "ws://localhost:6001"),
        // @ts-ignore
        new Node("node2", "ws://localhost:6002"),
      ];

      const ws = "notKnowNodeWS";

      // When
      // @ts-ignore
      const result = p2pServer.getNodeByWS(nodeList, ws);

      // Then
      // @ts-ignore
      expect(result).toEqual(null);
    });
  });

  describe("getNodeByURL", () => {
    it("should return node when nodes list contain the looked for node url", () => {
      // Given
      const nodeList = [
        // @ts-ignore
        new Node("node1", "ws://localhost:6001"),
        // @ts-ignore
        new Node("node2", "ws://localhost:6002"),
      ];

      const peerURL = "ws://localhost:6002";

      // When
      // @ts-ignore
      const result = p2pServer.getNodeByURL(nodeList, peerURL);

      // Then
      // @ts-ignore
      expect(result).toEqual(new Node("node2", "ws://localhost:6002"));
    });

    it("should return null when nodes list does NOT contain the looked for node url", () => {
      // Given
      const nodeList = [
        // @ts-ignore
        new Node("node1", "ws://localhost:6001"),
        // @ts-ignore
        new Node("node2", "ws://localhost:6002"),
      ];

      const peerURL = "notKnowNodeURL";

      // When
      // @ts-ignore
      const result = p2pServer.getNodeByURL(nodeList, peerURL);

      // Then
      // @ts-ignore
      expect(result).toEqual(null);
    });
  });
});
