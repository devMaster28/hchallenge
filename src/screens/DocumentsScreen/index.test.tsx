import type { ReactNode } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { pick } from '@react-native-documents/picker';
import { act, fireEvent, render, waitFor } from '@testing-library/react-native';

import type { Document } from '../../features/documents/models/document';
import DocumentsProvider from '../../features/documents/state/DocumentsProvider';
import type { DocumentNotification } from '../../features/notifications/models/notification';
import NotificationsProvider from '../../features/notifications/state/NotificationsProvider';
import { get } from '../../services/network/Api';
import type { LocalNotificationsService } from '../../services/notifications';
import type {
  RealtimeHandlers,
  RealtimeService,
} from '../../services/realtime';
import type { DocumentsStorageService } from '../../services/storage';
import DocumentsScreen from './index';

jest.mock('../../services/network/Api', () => ({
  get: jest.fn(),
}));

jest.mock('../../services/storage', () => ({
  asyncStorageDocumentsService: {
    getDocuments: jest.fn(),
    saveDocuments: jest.fn(),
  },
}));

jest.mock('../../services/notifications', () => ({
  notifeeLocalNotificationsService: {
    initialize: jest.fn().mockResolvedValue(true),
    display: jest.fn().mockResolvedValue(undefined),
  },
}));

jest.mock('@react-native-documents/picker', () => ({
  errorCodes: { OPERATION_CANCELED: 'OPERATION_CANCELED' },
  isErrorWithCode: jest.fn(() => false),
  pick: jest.fn(),
}));

const getMock = get as jest.MockedFunction<typeof get>;
const pickMock = pick as jest.MockedFunction<typeof pick>;

const olderDocument: Document = {
  ID: 'document-older',
  CreatedAt: '2026-08-14T10:00:00.000Z',
  Title: 'Alpha report',
  Version: '1.0.0',
  Contributors: [{ ID: 'user-1', Name: 'Ada Lovelace' }],
  Attachments: ['alpha.pdf'],
};

const newerDocument: Document = {
  ID: 'document-newer',
  CreatedAt: '2026-08-16T10:00:00.000Z',
  Title: 'Zulu report',
  Version: '2.0.0',
  Contributors: [],
  Attachments: [],
};

const createDeferred = <Value,>() => {
  let resolve!: (value: Value | PromiseLike<Value>) => void;
  const promise = new Promise<Value>(promiseResolve => {
    resolve = promiseResolve;
  });

  return { promise, resolve };
};

const createStorageService = (): jest.Mocked<DocumentsStorageService> => ({
  getDocuments: jest.fn().mockResolvedValue({
    localDocuments: [],
    remoteDocuments: [],
  }),
  saveDocuments: jest.fn().mockResolvedValue(undefined),
});

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
    getHandlers: () => {
      if (!handlers) {
        throw new Error('Realtime service has not connected');
      }

      return handlers;
    },
  };
};

interface TestAppProps {
  children: ReactNode;
  storageService: DocumentsStorageService;
  realtimeService: RealtimeService<DocumentNotification>;
  localNotificationsService: LocalNotificationsService;
}

function TestApp({
  children,
  storageService,
  realtimeService,
  localNotificationsService,
}: TestAppProps) {
  return (
    <SafeAreaProvider
      initialMetrics={{
        frame: { x: 0, y: 0, width: 390, height: 844 },
        insets: { top: 47, right: 0, bottom: 34, left: 0 },
      }}
    >
      <DocumentsProvider storageService={storageService}>
        <NotificationsProvider
          localNotificationsService={localNotificationsService}
          realtimeService={realtimeService}
        >
          {children}
        </NotificationsProvider>
      </DocumentsProvider>
    </SafeAreaProvider>
  );
}

const renderDocumentsScreen = async () => {
  const storageService = createStorageService();
  const realtime = createRealtimeService();
  const localNotificationsService = createLocalNotificationsService();
  const screen = await render(
    <TestApp
      localNotificationsService={localNotificationsService}
      realtimeService={realtime.service}
      storageService={storageService}
    >
      <DocumentsScreen />
    </TestApp>,
  );

  return {
    ...screen,
    storageService,
    realtime,
    localNotificationsService,
  };
};

describe('DocumentsScreen', () => {
  beforeEach(() => {
    getMock.mockReset();
    pickMock.mockReset();
    pickMock.mockResolvedValue([{ name: 'new-document.pdf' }] as never);
  });

  it('loads documents, sorts them and changes to grid view', async () => {
    // Arrange
    const request = createDeferred<unknown>();
    getMock.mockReturnValue(request.promise);

    // Act
    const screen = await renderDocumentsScreen();

    // Assert
    expect(screen.getByRole('header', { name: 'Documents' })).toBeOnTheScreen();
    expect(screen.getByTestId('documents-loading')).toBeOnTheScreen();

    // Act
    await act(async () => {
      request.resolve([olderDocument, newerDocument]);
    });

    // Assert
    await waitFor(() =>
      expect(screen.getByText('Zulu report')).toBeOnTheScreen(),
    );
    expect(
      screen.getAllByText(/report$/).map(node => node.props.children),
    ).toEqual(['Zulu report', 'Alpha report']);

    // Act
    await fireEvent.press(
      screen.getByRole('button', {
        name: 'Sort documents, Date selected',
      }),
    );
    await fireEvent.press(screen.getByText('Alphabetical'));

    // Assert
    expect(
      screen.getAllByText(/report$/).map(node => node.props.children),
    ).toEqual(['Alpha report', 'Zulu report']);

    // Act
    await fireEvent.press(screen.getByRole('tab', { name: 'Grid view' }));

    // Assert
    expect(screen.getByTestId('documents-grid')).toBeOnTheScreen();
    expect(screen.getByRole('tab', { name: 'Grid view' })).toBeSelected();
    expect(screen.queryByText('Contributors')).not.toBeOnTheScreen();
  });

  it('refreshes and replaces the remote documents', async () => {
    // Arrange
    const refreshRequest = createDeferred<unknown>();
    getMock
      .mockResolvedValueOnce([olderDocument])
      .mockReturnValueOnce(refreshRequest.promise);
    const screen = await renderDocumentsScreen();
    await waitFor(() =>
      expect(screen.getByText('Alpha report')).toBeOnTheScreen(),
    );
    const getRefreshControl = () => {
      const refreshControl = screen.getByTestId('documents-list').children[0];

      if (typeof refreshControl === 'string') {
        throw new Error('Refresh control was not rendered');
      }

      return refreshControl;
    };

    // Act
    const refreshControl = getRefreshControl();
    await fireEvent(refreshControl, 'refresh');

    // Assert
    expect(getMock).toHaveBeenCalledTimes(2);
    expect(screen.getByText('Alpha report')).toBeOnTheScreen();

    // Act
    await act(async () => {
      refreshRequest.resolve([newerDocument]);
    });

    // Assert
    await waitFor(() =>
      expect(screen.getByText('Zulu report')).toBeOnTheScreen(),
    );
    expect(screen.queryByText('Alpha report')).not.toBeOnTheScreen();
  });

  it('creates a local document from the add document modal', async () => {
    // Arrange
    getMock.mockResolvedValue([]);
    const screen = await renderDocumentsScreen();
    await waitFor(() =>
      expect(screen.getByTestId('documents-empty')).toBeOnTheScreen(),
    );

    // Act
    await fireEvent.press(screen.getByRole('button', { name: 'Add document' }));
    await fireEvent.changeText(
      screen.getByLabelText('Document name'),
      'New local document',
    );
    await fireEvent.changeText(
      screen.getByLabelText('Document version'),
      '3.0.0',
    );
    await fireEvent.press(screen.getByRole('button', { name: 'Choose file' }));
    await waitFor(() =>
      expect(screen.getByText('new-document.pdf')).toBeOnTheScreen(),
    );
    await fireEvent.press(screen.getByRole('button', { name: 'Submit' }));

    // Assert
    await waitFor(() =>
      expect(screen.getByText('New local document')).toBeOnTheScreen(),
    );
    expect(screen.getByText('Version 3.0.0')).toBeOnTheScreen();
    expect(
      screen.queryByRole('header', { name: 'Add document' }),
    ).not.toBeOnTheScreen();
    await waitFor(() =>
      expect(screen.storageService.saveDocuments).toHaveBeenLastCalledWith({
        localDocuments: [
          expect.objectContaining({
            Title: 'New local document',
            Version: '3.0.0',
            Attachments: ['new-document.pdf'],
          }),
        ],
        remoteDocuments: [],
      }),
    );
  });

  it('shows realtime notifications and marks them as read when opened', async () => {
    // Arrange
    getMock.mockResolvedValue([]);
    const screen = await renderDocumentsScreen();
    await waitFor(() =>
      expect(screen.getByTestId('documents-empty')).toBeOnTheScreen(),
    );
    const notification: DocumentNotification = {
      Timestamp: '2026-08-16T10:00:00.000Z',
      UserID: 'user-1',
      UserName: 'Ada Lovelace',
      DocumentID: 'document-1',
      DocumentTitle: 'Realtime report',
    };

    // Act
    await act(async () => {
      screen.realtime.getHandlers().onMessage(notification);
    });

    // Assert
    expect(
      screen.getByRole('button', { name: 'Notifications, 1 unread' }),
    ).toBeOnTheScreen();
    expect(screen.getByTestId('notifications-badge')).toHaveTextContent('1');
    await waitFor(() =>
      expect(screen.localNotificationsService.display).toHaveBeenCalled(),
    );

    // Act
    await fireEvent.press(
      screen.getByRole('button', { name: 'Notifications, 1 unread' }),
    );

    // Assert
    expect(
      screen.getByRole('header', { name: 'Notifications' }),
    ).toBeOnTheScreen();
    expect(screen.getByText('Realtime report')).toBeOnTheScreen();
    expect(screen.getByText('Created by Ada Lovelace')).toBeOnTheScreen();
    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: 'Notifications' }),
      ).toBeOnTheScreen(),
    );
  });

  it('retries after the initial backend request fails', async () => {
    // Arrange
    getMock
      .mockRejectedValueOnce(new Error('Network unavailable'))
      .mockResolvedValueOnce([newerDocument]);

    // Act
    const screen = await renderDocumentsScreen();

    // Assert
    await waitFor(() =>
      expect(screen.getByTestId('documents-error')).toBeOnTheScreen(),
    );
    expect(screen.getByText('Unable to load documents')).toBeOnTheScreen();

    // Act
    await fireEvent.press(screen.getByRole('button', { name: 'Try again' }));

    // Assert
    await waitFor(() =>
      expect(screen.getByText('Zulu report')).toBeOnTheScreen(),
    );
    expect(getMock).toHaveBeenCalledTimes(2);
    expect(screen.queryByTestId('documents-error')).not.toBeOnTheScreen();
  });
});
