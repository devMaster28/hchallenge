import { toError } from '../../utils/error';

export enum RealtimeConnectionStatus {
  Connecting = 'connecting',
  Connected = 'connected',
  Reconnecting = 'reconnecting',
  Disconnected = 'disconnected',
}

export interface RealtimeHandlers<Message> {
  onMessage: (message: Message) => void;
  onStatusChange?: (status: RealtimeConnectionStatus) => void;
  onError?: (error: Error) => void;
}

export interface RealtimeService<Message> {
  connect: (handlers: RealtimeHandlers<Message>) => () => void;
}

export interface WebSocketLike {
  onopen: (() => void) | null;
  onmessage: ((event: { data: unknown }) => void) | null;
  onerror: (() => void) | null;
  onclose: (() => void) | null;
  close: () => void;
}

export type WebSocketFactory = (url: string) => WebSocketLike;

interface CreateWebSocketServiceOptions<Message> {
  url: string;
  parseMessage: (data: unknown) => Message;
  reconnectDelay?: number;
  maxReconnectDelay?: number;
}

const createNativeWebSocket: WebSocketFactory = url =>
  new WebSocket(url) as unknown as WebSocketLike;

export const createWebSocketService = <Message>(
  {
    url,
    parseMessage,
    reconnectDelay = 1_000,
    maxReconnectDelay = 10_000,
  }: CreateWebSocketServiceOptions<Message>,
  createSocket: WebSocketFactory = createNativeWebSocket,
): RealtimeService<Message> => ({
  connect(handlers) {
    let active = true;
    let reconnectAttempt = 0;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let socket: WebSocketLike | null = null;

    const notifyError = (reason: unknown) => {
      handlers.onError?.(toError(reason, 'Unknown realtime error'));
    };

    const openConnection = () => {
      if (!active) {
        return;
      }

      handlers.onStatusChange?.(RealtimeConnectionStatus.Connecting);
      socket = createSocket(url);

      socket.onopen = () => {
        reconnectAttempt = 0;
        handlers.onStatusChange?.(RealtimeConnectionStatus.Connected);
      };

      socket.onmessage = event => {
        try {
          handlers.onMessage(parseMessage(event.data));
        } catch (error) {
          notifyError(error);
        }
      };

      socket.onerror = () => {
        notifyError(new Error('Unable to connect to realtime notifications'));
      };

      socket.onclose = () => {
        if (!active) {
          return;
        }

        const delay = Math.min(
          reconnectDelay * 2 ** reconnectAttempt,
          maxReconnectDelay,
        );
        reconnectAttempt += 1;
        handlers.onStatusChange?.(RealtimeConnectionStatus.Reconnecting);
        reconnectTimer = setTimeout(openConnection, delay);
      };
    };

    openConnection();

    return () => {
      active = false;

      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
      }

      socket?.close();
      socket = null;
    };
  },
});
