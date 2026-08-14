import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';

import { endpoints } from '../../../../services/network/endpoints';
import {
  createWebSocketService,
  RealtimeConnectionStatus,
} from '../../../../services/realtime';
import type { RealtimeService } from '../../../../services/realtime';
import {
  parseDocumentNotification,
} from '../../models/notification';
import type { DocumentNotification } from '../../models/notification';
import {
  initialNotificationsState,
  notificationsActions,
  notificationsReducer,
} from '../notificationsReducer';

interface NotificationsContextValue {
  notifications: DocumentNotification[];
  latestNotification: DocumentNotification | null;
  unreadCount: number;
  connectionStatus: RealtimeConnectionStatus;
  connectionError: Error | null;
  dismissLatestNotification: () => void;
  markAllAsRead: () => void;
}

interface NotificationsProviderProps {
  children: ReactNode;
  realtimeService?: RealtimeService<DocumentNotification>;
}

const documentNotificationsService =
  createWebSocketService<DocumentNotification>({
    url: endpoints.notifications,
    parseMessage: parseDocumentNotification,
  });

const NotificationsContext =
  createContext<NotificationsContextValue | null>(null);

export default function NotificationsProvider({
  children,
  realtimeService = documentNotificationsService,
}: NotificationsProviderProps) {
  const [state, dispatch] = useReducer(
    notificationsReducer,
    initialNotificationsState,
  );

  useEffect(
    () =>
      realtimeService.connect({
        onMessage: notification => {
          dispatch(notificationsActions.received(notification));
        },
        onStatusChange: status => {
          dispatch(notificationsActions.connectionChanged(status));
        },
        onError: error => {
          dispatch(notificationsActions.connectionFailed(error));
        },
      }),
    [realtimeService],
  );

  const dismissLatestNotification = useCallback(() => {
    dispatch(notificationsActions.dismissLatest());
  }, []);

  const markAllAsRead = useCallback(() => {
    dispatch(notificationsActions.markAllAsRead());
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      dismissLatestNotification,
      markAllAsRead,
    }),
    [state, dismissLatestNotification, markAllAsRead],
  );

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

export const useNotifications = (): NotificationsContextValue => {
  const context = useContext(NotificationsContext);

  if (!context) {
    throw new Error(
      'useNotifications must be used inside NotificationsProvider',
    );
  }

  return context;
};
