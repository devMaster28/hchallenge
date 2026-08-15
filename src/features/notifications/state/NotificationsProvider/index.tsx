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
import { notifeeLocalNotificationsService } from '../../../../services/notifications';
import type { LocalNotificationsService } from '../../../../services/notifications';
import {
  createWebSocketService,
  RealtimeConnectionStatus,
} from '../../../../services/realtime';
import type { RealtimeService } from '../../../../services/realtime';
import { toError } from '../../../../utils/error';
import { parseDocumentNotification } from '../../models/notification';
import type { DocumentNotification } from '../../models/notification';
import { buildLocalNotification } from '../../utils/buildLocalNotification';
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
  localNotificationError: Error | null;
  dismissLatestNotification: () => void;
  markAllAsRead: () => void;
}

interface NotificationsProviderProps {
  children: ReactNode;
  realtimeService?: RealtimeService<DocumentNotification>;
  localNotificationsService?: LocalNotificationsService;
}

const documentNotificationsService =
  createWebSocketService<DocumentNotification>({
    url: endpoints.notifications,
    parseMessage: parseDocumentNotification,
  });

const NotificationsContext = createContext<NotificationsContextValue | null>(
  null,
);

export default function NotificationsProvider({
  children,
  realtimeService = documentNotificationsService,
  localNotificationsService = notifeeLocalNotificationsService,
}: NotificationsProviderProps) {
  const [state, dispatch] = useReducer(
    notificationsReducer,
    initialNotificationsState,
  );

  useEffect(() => {
    localNotificationsService.initialize().catch(reason => {
      dispatch(notificationsActions.localNotificationFailed(toError(reason)));
    });
  }, [localNotificationsService]);

  useEffect(
    () =>
      realtimeService.connect({
        onMessage: notification => {
          dispatch(notificationsActions.received(notification));
          localNotificationsService
            .display(buildLocalNotification(notification))
            .catch(reason => {
              dispatch(
                notificationsActions.localNotificationFailed(toError(reason)),
              );
            });
        },
        onStatusChange: status => {
          dispatch(notificationsActions.connectionChanged(status));
        },
        onError: error => {
          dispatch(notificationsActions.connectionFailed(error));
        },
      }),
    [localNotificationsService, realtimeService],
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
