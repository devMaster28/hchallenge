import type { DocumentNotification } from '../models/notification';
import { RealtimeConnectionStatus } from '../../../services/realtime';

const MAX_NOTIFICATIONS = 50;

export interface NotificationsState {
  notifications: DocumentNotification[];
  unreadCount: number;
  connectionStatus: RealtimeConnectionStatus;
  connectionError: Error | null;
  localNotificationError: Error | null;
}

export const initialNotificationsState: NotificationsState = {
  notifications: [],
  unreadCount: 0,
  connectionStatus: RealtimeConnectionStatus.Disconnected,
  connectionError: null,
  localNotificationError: null,
};

export enum NotificationsActionType {
  Received = 'received',
  MarkAllAsRead = 'markAllAsRead',
  ConnectionChanged = 'connectionChanged',
  ConnectionFailed = 'connectionFailed',
  LocalNotificationFailed = 'localNotificationFailed',
}

export const notificationsActions = {
  received: (notification: DocumentNotification) => ({
    type: NotificationsActionType.Received as const,
    payload: notification,
  }),
  markAllAsRead: () => ({
    type: NotificationsActionType.MarkAllAsRead as const,
  }),
  connectionChanged: (status: RealtimeConnectionStatus) => ({
    type: NotificationsActionType.ConnectionChanged as const,
    payload: status,
  }),
  connectionFailed: (error: Error) => ({
    type: NotificationsActionType.ConnectionFailed as const,
    payload: error,
  }),
  localNotificationFailed: (error: Error) => ({
    type: NotificationsActionType.LocalNotificationFailed as const,
    payload: error,
  }),
};

type NotificationsAction = ReturnType<
  (typeof notificationsActions)[keyof typeof notificationsActions]
>;

export const notificationsReducer = (
  state: NotificationsState,
  action: NotificationsAction,
): NotificationsState => {
  switch (action.type) {
    case NotificationsActionType.Received:
      return {
        ...state,
        notifications: [action.payload, ...state.notifications].slice(
          0,
          MAX_NOTIFICATIONS,
        ),
        unreadCount: state.unreadCount + 1,
      };
    case NotificationsActionType.MarkAllAsRead:
      return {
        ...state,
        unreadCount: 0,
      };
    case NotificationsActionType.ConnectionChanged:
      return {
        ...state,
        connectionStatus: action.payload,
        connectionError:
          action.payload === RealtimeConnectionStatus.Connected
            ? null
            : state.connectionError,
      };
    case NotificationsActionType.ConnectionFailed:
      return {
        ...state,
        connectionError: action.payload,
      };
    case NotificationsActionType.LocalNotificationFailed:
      return {
        ...state,
        localNotificationError: action.payload,
      };
  }
};
