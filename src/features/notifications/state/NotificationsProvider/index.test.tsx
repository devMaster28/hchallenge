import type { ReactNode } from 'react';
import { act, renderHook, waitFor } from '@testing-library/react-native';

import type { LocalNotificationsService } from '../../../../services/notifications';
import { RealtimeConnectionStatus } from '../../../../services/realtime';
import type {
  RealtimeHandlers,
  RealtimeService,
} from '../../../../services/realtime';
import type { DocumentNotification } from '../../models/notification';
import NotificationsProvider, { useNotifications } from './index';

jest.mock('../../../../services/notifications', () => ({
  notifeeLocalNotificationsService: {
    initialize: jest.fn().mockResolvedValue(true),
    display: jest.fn().mockResolvedValue(undefined),
  },
}));

const notification: DocumentNotification = {
  Timestamp: '2026-08-16T10:00:00.000Z',
  UserID: 'user-1',
  UserName: 'Ada',
  DocumentID: 'document-1',
  DocumentTitle: 'Annual report',
};

const createLocalNotificationsService =
  (): jest.Mocked<LocalNotificationsService> => ({
    initialize: jest.fn().mockResolvedValue(true),
    display: jest.fn().mockResolvedValue(undefined),
  });

const createRealtimeService = () => {
  let handlers: RealtimeHandlers<DocumentNotification> | undefined;
  const disconnect = jest.fn();
  const service: RealtimeService<DocumentNotification> = {
    connect: jest.fn(receivedHandlers => {
      handlers = receivedHandlers;
      return disconnect;
    }),
  };

  return {
    service,
    disconnect,
    getHandlers: () => {
      if (!handlers) {
        throw new Error('Realtime service has not connected');
      }

      return handlers;
    },
  };
};

const createWrapper = (
  realtimeService: RealtimeService<DocumentNotification>,
  localNotificationsService: LocalNotificationsService,
) =>
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <NotificationsProvider
        realtimeService={realtimeService}
        localNotificationsService={localNotificationsService}
      >
        {children}
      </NotificationsProvider>
    );
  };

describe('NotificationsProvider', () => {
  it('initializes local notifications, connects and disconnects realtime', async () => {
    // Arrange
    const realtime = createRealtimeService();
    const localNotificationsService = createLocalNotificationsService();

    // Act
    const { unmount } = await renderHook(() => useNotifications(), {
      wrapper: createWrapper(realtime.service, localNotificationsService),
    });

    // Assert
    await waitFor(() =>
      expect(localNotificationsService.initialize).toHaveBeenCalledTimes(1),
    );
    expect(realtime.service.connect).toHaveBeenCalledTimes(1);

    // Act
    await unmount();

    // Assert
    expect(realtime.disconnect).toHaveBeenCalledTimes(1);
  });

  it('stores received notifications, increments unread count and displays them locally', async () => {
    // Arrange
    const realtime = createRealtimeService();
    const localNotificationsService = createLocalNotificationsService();
    const { result } = await renderHook(() => useNotifications(), {
      wrapper: createWrapper(realtime.service, localNotificationsService),
    });

    // Act
    await act(async () => {
      realtime.getHandlers().onMessage(notification);
    });

    // Assert
    expect(result.current.notifications).toEqual([notification]);
    expect(result.current.unreadCount).toBe(1);
    await waitFor(() =>
      expect(localNotificationsService.display).toHaveBeenCalledWith({
        id: 'document-created',
        title: 'New document',
        body: 'Ada created “Annual report”',
        data: {
          documentId: 'document-1',
          userId: 'user-1',
        },
      }),
    );

    // Act
    await act(async () => {
      result.current.markAllAsRead();
    });

    // Assert
    expect(result.current.unreadCount).toBe(0);
    expect(result.current.notifications).toEqual([notification]);
  });

  it('reflects realtime connection status and errors', async () => {
    // Arrange
    const realtime = createRealtimeService();
    const localNotificationsService = createLocalNotificationsService();
    const connectionError = new Error('Connection lost');
    const { result } = await renderHook(() => useNotifications(), {
      wrapper: createWrapper(realtime.service, localNotificationsService),
    });

    // Act
    await act(async () => {
      realtime
        .getHandlers()
        .onStatusChange?.(RealtimeConnectionStatus.Connected);
      realtime.getHandlers().onError?.(connectionError);
    });

    // Assert
    expect(result.current.connectionStatus).toBe(
      RealtimeConnectionStatus.Connected,
    );
    expect(result.current.connectionError).toBe(connectionError);
  });

  it('exposes local notification initialization failures', async () => {
    // Arrange
    const realtime = createRealtimeService();
    const localNotificationsService = createLocalNotificationsService();
    const initializationError = new Error('Permission unavailable');
    localNotificationsService.initialize.mockRejectedValue(initializationError);

    // Act
    const { result } = await renderHook(() => useNotifications(), {
      wrapper: createWrapper(realtime.service, localNotificationsService),
    });

    // Assert
    await waitFor(() =>
      expect(result.current.localNotificationError).toBe(initializationError),
    );
  });

  it('keeps the notification and exposes local display failures', async () => {
    // Arrange
    const realtime = createRealtimeService();
    const localNotificationsService = createLocalNotificationsService();
    const displayError = new Error('Notification could not be displayed');
    localNotificationsService.display.mockRejectedValue(displayError);
    const { result } = await renderHook(() => useNotifications(), {
      wrapper: createWrapper(realtime.service, localNotificationsService),
    });

    // Act
    await act(async () => {
      realtime.getHandlers().onMessage(notification);
    });

    // Assert
    await waitFor(() =>
      expect(result.current.localNotificationError).toBe(displayError),
    );
    expect(result.current.notifications).toEqual([notification]);
    expect(result.current.unreadCount).toBe(1);
  });
});
