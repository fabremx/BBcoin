import P2pServer from "./p2pServer";
jest.spyOn(console, "error").mockImplementation();
jest.spyOn(console, "log").mockImplementation();

import Node from "../commons/Node";

const PORT = 6000;
const p2pServer: P2pServer = new P2pServer(PORT);

jest.mock("ws");

describe("P2p Server Class", () => {
  describe("AddNodes", () => {
    it("should add the connected node when new node connect", () => {
      // Given
      const ws = "node1";
      const req = {
        url: "/?nodePort=6001",
      };

      // When
      // @ts-ignore
      p2pServer.addNode(ws, req);

      // Then
      const expectedResult = [{ ws: "node1", url: "ws://localhost:6001" }];
      expect(p2pServer.connectedNodes).toEqual(expectedResult);
    });

    it("should NOT add the connected node when the same node connect but is already registered", () => {
      // Given

      p2pServer.connectedNodes = [
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
      p2pServer.addNode(ws, req);

      // Then
      const expectedResult = [
        { ws: "node1", url: "ws://localhost:6001" },
        { ws: "node2", url: "ws://localhost:6002" },
      ];
      expect(p2pServer.connectedNodes).toEqual(expectedResult);
    });
  });

  describe("DeleteNode", () => {
    it("should delete node when node disconnect", () => {
      // Given
      p2pServer.connectedNodes = [
        // @ts-ignore
        new Node("node1", "ws://localhost:6001"),
        // @ts-ignore
        new Node("node2", "ws://localhost:6002"),
        // @ts-ignore
        new Node("node3", "ws://localhost:6003"),
      ];

      // @ts-ignore
      const ws = "node2";

      // When
      // @ts-ignore
      p2pServer.deleteNode(ws);

      // Then
      const expectedResult = [
        { ws: "node1", url: "ws://localhost:6001" },
        { ws: "node3", url: "ws://localhost:6003" },
      ];
      expect(p2pServer.connectedNodes).toEqual(expectedResult);
    });

    it("should do nothing when the node to delete is already deleted", () => {
      // Given
      p2pServer.connectedNodes = [
        // @ts-ignore
        new Node("node1", "ws://localhost:6001"),
        // @ts-ignore
        new Node("node3", "ws://localhost:6003"),
      ];

      const req = {
        url: "ws://localhost:6002",
      };

      // When
      // @ts-ignore
      p2pServer.deleteNode(req);

      // Then
      const expectedResult = [
        { ws: "node1", url: "ws://localhost:6001" },
        { ws: "node3", url: "ws://localhost:6003" },
      ];
      expect(p2pServer.connectedNodes).toEqual(expectedResult);
    });
  });

  describe("getConnectedNodesURL", () => {
    it("should return empty array when connectedNodes is empty", () => {
      // Given
      const connectedNodes = (p2pServer.connectedNodes = [
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
      const connectedNodes = (p2pServer.connectedNodes = []);

      // Given
      const result = p2pServer.getConnectedNodesURL();

      // Then
      expect(result).toEqual([]);
    });
  });
});
