import {
  createWebSocketService,
  RealtimeConnectionStatus,
} from './WebSocketService';
import type {
  RealtimeHandlers,
  WebSocketFactory,
  WebSocketLike,
} from './WebSocketService';

interface TestMessage {
  id: string;
}

const createSocket = (): WebSocketLike => ({
  onopen: null,
  onmessage: null,
  onerror: null,
  onclose: null,
  close: jest.fn(),
});

const createSocketFactory = () => {
  const sockets: WebSocketLike[] = [];
  const factory = jest.fn<WebSocketLike, Parameters<WebSocketFactory>>(() => {
    const socket = createSocket();
    sockets.push(socket);
    return socket;
  });

  return { factory, sockets };
};

const createHandlers = (): jest.Mocked<RealtimeHandlers<TestMessage>> => ({
  onMessage: jest.fn(),
  onStatusChange: jest.fn(),
  onError: jest.fn(),
});

describe('WebSocketService', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it('connects, parses messages and reports connection status', () => {
    // Arrange
    const { factory, sockets } = createSocketFactory();
    const parseMessage = jest.fn<TestMessage, [unknown]>(() => ({
      id: 'document-1',
    }));
    const handlers = createHandlers();
    const service = createWebSocketService(
      {
        url: 'ws://localhost:8080/notifications',
        parseMessage,
      },
      factory,
    );

    // Act
    service.connect(handlers);
    sockets[0].onopen?.();
    sockets[0].onmessage?.({ data: '{"DocumentID":"document-1"}' });

    // Assert
    expect(factory).toHaveBeenCalledWith('ws://localhost:8080/notifications');
    expect(handlers.onStatusChange).toHaveBeenNthCalledWith(
      1,
      RealtimeConnectionStatus.Connecting,
    );
    expect(handlers.onStatusChange).toHaveBeenNthCalledWith(
      2,
      RealtimeConnectionStatus.Connected,
    );
    expect(parseMessage).toHaveBeenCalledWith('{"DocumentID":"document-1"}');
    expect(handlers.onMessage).toHaveBeenCalledWith({ id: 'document-1' });
  });

  it('reports parser failures without delivering an invalid message', () => {
    // Arrange
    const { factory, sockets } = createSocketFactory();
    const parserError = new Error('Invalid notification payload');
    const parseMessage = jest.fn<TestMessage, [unknown]>(() => {
      throw parserError;
    });
    const handlers = createHandlers();
    const service = createWebSocketService(
      {
        url: 'ws://localhost/notifications',
        parseMessage,
      },
      factory,
    );
    service.connect(handlers);

    // Act
    sockets[0].onmessage?.({ data: 'invalid-message' });

    // Assert
    expect(handlers.onError).toHaveBeenCalledWith(parserError);
    expect(handlers.onMessage).not.toHaveBeenCalled();
  });

  it('reports native WebSocket errors', () => {
    // Arrange
    const { factory, sockets } = createSocketFactory();
    const handlers = createHandlers();
    const service = createWebSocketService(
      {
        url: 'ws://localhost/notifications',
        parseMessage: data => data as TestMessage,
      },
      factory,
    );
    service.connect(handlers);

    // Act
    sockets[0].onerror?.();

    // Assert
    expect(handlers.onError).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Unable to connect to realtime notifications',
      }),
    );
  });

  it('reconnects with exponential backoff capped at the configured delay', () => {
    // Arrange
    jest.useFakeTimers();
    const { factory, sockets } = createSocketFactory();
    const handlers = createHandlers();
    const service = createWebSocketService(
      {
        url: 'ws://localhost/notifications',
        parseMessage: data => data as TestMessage,
        reconnectDelay: 100,
        maxReconnectDelay: 150,
      },
      factory,
    );
    const disconnect = service.connect(handlers);

    // Act
    sockets[0].onclose?.();
    jest.advanceTimersByTime(99);

    // Assert
    expect(factory).toHaveBeenCalledTimes(1);
    expect(handlers.onStatusChange).toHaveBeenLastCalledWith(
      RealtimeConnectionStatus.Reconnecting,
    );

    // Act
    jest.advanceTimersByTime(1);
    sockets[1].onclose?.();
    jest.advanceTimersByTime(149);

    // Assert
    expect(factory).toHaveBeenCalledTimes(2);

    // Act
    jest.advanceTimersByTime(1);

    // Assert
    expect(factory).toHaveBeenCalledTimes(3);
    expect(handlers.onStatusChange).toHaveBeenLastCalledWith(
      RealtimeConnectionStatus.Connecting,
    );

    // Act
    disconnect();
  });

  it('resets the reconnect delay after a connection succeeds', () => {
    // Arrange
    jest.useFakeTimers();
    const { factory, sockets } = createSocketFactory();
    const service = createWebSocketService(
      {
        url: 'ws://localhost/notifications',
        parseMessage: data => data as TestMessage,
        reconnectDelay: 100,
        maxReconnectDelay: 1_000,
      },
      factory,
    );
    const disconnect = service.connect(createHandlers());
    sockets[0].onclose?.();
    jest.advanceTimersByTime(100);

    // Act
    sockets[1].onopen?.();
    sockets[1].onclose?.();
    jest.advanceTimersByTime(100);

    // Assert
    expect(factory).toHaveBeenCalledTimes(3);

    // Act
    disconnect();
  });

  it('closes the socket and cancels pending reconnections on cleanup', () => {
    // Arrange
    jest.useFakeTimers();
    const { factory, sockets } = createSocketFactory();
    const service = createWebSocketService(
      {
        url: 'ws://localhost/notifications',
        parseMessage: data => data as TestMessage,
        reconnectDelay: 100,
      },
      factory,
    );
    const disconnect = service.connect(createHandlers());
    sockets[0].onclose?.();

    // Act
    disconnect();
    sockets[0].onclose?.();
    jest.runAllTimers();

    // Assert
    expect(sockets[0].close).toHaveBeenCalledTimes(1);
    expect(factory).toHaveBeenCalledTimes(1);
  });
});
