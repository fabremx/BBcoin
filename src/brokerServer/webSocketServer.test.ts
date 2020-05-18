jest.spyOn(console, "error").mockImplementation();
jest.spyOn(console, "log").mockImplementation();

import webSocketServerInstance, { WebSocketServer } from "./webSocketServer";

let webSocketServer: WebSocketServer;

describe("WebSocket Server for borker server", () => {
  beforeAll(() => {
    webSocketServer = webSocketServerInstance;
  });

  describe("AddNodes", () => {
    it("should add the connected node when new node connect", () => {
      // Given
      const ws = "node1";
      const req = {
        url: "/?nodePort=6001",
      };

      // When
      // @ts-ignore
      webSocketServer.addNode(ws, req);

      // Then
      const expectedResult = [{ ws: "node1", url: "ws://localhost:6001" }];
      expect(webSocketServer.connectedNodes).toEqual(expectedResult);
    });

    it("should NOT add the connected node when the same node connect but is already registered", () => {
      // Given
      webSocketServer.connectedNodes = [
        { ws: "node1", url: "ws://localhost:6001" },
        { ws: "node2", url: "ws://localhost:6002" },
      ];

      const ws = "node1";
      const req = {
        url: "/?nodePort=6001",
      };

      // When
      // @ts-ignore
      webSocketServer.addNode(ws, req);

      // Then
      const expectedResult = [
        { ws: "node1", url: "ws://localhost:6001" },
        { ws: "node2", url: "ws://localhost:6002" },
      ];
      expect(webSocketServer.connectedNodes).toEqual(expectedResult);
    });
  });

  describe("DeleteNode", () => {
    it("should delete node when node disconnect", () => {
      // Given
      webSocketServer.connectedNodes = [
        { ws: "node1", url: "ws://localhost:6001" },
        { ws: "node2", url: "ws://localhost:6002" },
        { ws: "node3", url: "ws://localhost:6003" },
      ];

      const req = {
        url: "ws://localhost:6002",
      };

      // When
      // @ts-ignore
      webSocketServer.deleteNode(req);

      // Then
      const expectedResult = [
        { ws: "node1", url: "ws://localhost:6001" },
        { ws: "node3", url: "ws://localhost:6003" },
      ];
      expect(webSocketServer.connectedNodes).toEqual(expectedResult);
    });

    it("should do nothing when the node to delete is already deleted", () => {
      // Given
      webSocketServer.connectedNodes = [
        { ws: "node1", url: "ws://localhost:6001" },
        { ws: "node3", url: "ws://localhost:6003" },
      ];

      const req = {
        url: "ws://localhost:6002",
      };

      // When
      // @ts-ignore
      webSocketServer.deleteNode(req);

      // Then
      const expectedResult = [
        { ws: "node1", url: "ws://localhost:6001" },
        { ws: "node3", url: "ws://localhost:6003" },
      ];
      expect(webSocketServer.connectedNodes).toEqual(expectedResult);
    });
  });

  describe("getConnectedNodesURL", () => {
    it("should return empty array when connectedNodes is empty", () => {
      // Given
      const connectedNodes = (webSocketServer.connectedNodes = [
        { ws: "node1", url: "ws://localhost:6001" },
        { ws: "node3", url: "ws://localhost:6003" },
      ]);

      // Given
      const result = webSocketServer.getConnectedNodesURL();

      // Then
      const expectedResult = ["ws://localhost:6001", "ws://localhost:6003"];
      expect(result).toEqual(expectedResult);
    });

    it("should return only url in an array when connectedNodes is NOT empty", () => {
      // Given
      const connectedNodes = (webSocketServer.connectedNodes = []);

      // Given
      const result = webSocketServer.getConnectedNodesURL();

      // Then
      expect(result).toEqual([]);
    });
  });

  afterAll(() => {
    webSocketServer.server.close();
  });
});
