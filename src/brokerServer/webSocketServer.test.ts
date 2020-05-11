jest.spyOn(console, "error").mockImplementation();
jest.spyOn(console, "log").mockImplementation();

import webSocketServerInstance, { WebSocketServer } from "./webSocketServer";

let webSocketServer: WebSocketServer;

describe("WebSocket Server for borker server", () => {
  beforeAll(() => {
    webSocketServer = webSocketServerInstance;
  });

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

  it("should delete node when node disconnect", () => {
    // Given
    webSocketServer.connectedNodes = [
      { ws: "node1", url: "ws://localhost:6001" },
      { ws: "node2", url: "ws://localhost:6002" },
      { ws: "node3", url: "ws://localhost:6003" },
    ];
    const nodeUtlToDelete = "ws://localhost:6002";

    // When
    // @ts-ignore
    webSocketServer.deleteNode(nodeUtlToDelete);

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
    const nodeUtlToDelete = "ws://localhost:6002";

    // When
    // @ts-ignore
    webSocketServer.deleteNode(nodeUtlToDelete);

    // Then
    const expectedResult = [
      { ws: "node1", url: "ws://localhost:6001" },
      { ws: "node3", url: "ws://localhost:6003" },
    ];
    expect(webSocketServer.connectedNodes).toEqual(expectedResult);
  });

  afterAll(() => {
    webSocketServer.server.close();
  });
});
