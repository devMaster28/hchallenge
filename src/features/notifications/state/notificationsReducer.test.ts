import type { DocumentNotification } from '../models/notification';
import { RealtimeConnectionStatus } from '../../../services/realtime';
import {
  initialNotificationsState,
  notificationsActions,
  notificationsReducer,
} from './notificationsReducer';
import type { NotificationsState } from './notificationsReducer';

const notification: DocumentNotification = {
  DocumentID: 'document-id',
  DocumentTitle: 'Annual report',
};

describe('notificationsReducer', () => {
  it('stores received notifications and increments the unread count', () => {
    // Arrange
    const action = notificationsActions.received(notification);

    // Act
    const state = notificationsReducer(initialNotificationsState, action);

    // Assert
    expect(state.notifications).toEqual([notification]);
    expect(state.unreadCount).toBe(1);
  });

  it('marks every notification as read', () => {
    // Arrange
    const currentState = { ...initialNotificationsState, unreadCount: 3 };
    const action = notificationsActions.markAllAsRead();

    // Act
    const state = notificationsReducer(currentState, action);

    // Assert
    expect(state.unreadCount).toBe(0);
  });

  it('keeps only the latest 50 notifications', () => {
    // Arrange
    const receivedNotifications = Array.from({ length: 51 });

    // Act
    const state = receivedNotifications.reduce<NotificationsState>(
      currentState =>
        notificationsReducer(
          currentState,
          notificationsActions.received(notification),
        ),
      initialNotificationsState,
    );

    // Assert
    expect(state.notifications).toHaveLength(50);
    expect(state.unreadCount).toBe(51);
  });

  it('clears a previous connection error after reconnecting', () => {
    // Arrange
    const currentState = {
      ...initialNotificationsState,
      connectionError: new Error('Connection lost'),
    };
    const action = notificationsActions.connectionChanged(
      RealtimeConnectionStatus.Connected,
    );

    // Act
    const state = notificationsReducer(currentState, action);

    // Assert
    expect(state.connectionStatus).toBe(RealtimeConnectionStatus.Connected);
    expect(state.connectionError).toBeNull();
  });

  it('stores local notification errors separately from connection errors', () => {
    // Arrange
    const error = new Error('Notifications are unavailable');
    const action = notificationsActions.localNotificationFailed(error);

    // Act
    const state = notificationsReducer(initialNotificationsState, action);

    // Assert
    expect(state.localNotificationError).toBe(error);
    expect(state.connectionError).toBeNull();
  });
});
