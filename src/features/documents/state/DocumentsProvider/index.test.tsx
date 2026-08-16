import type { ReactNode } from 'react';
import { act, renderHook, waitFor } from '@testing-library/react-native';

import type {
  DocumentsStorageService,
  StoredDocuments,
} from '../../../../services/storage';
import type { Document } from '../../models/document';
import DocumentsProvider, { useDocuments } from './index';

jest.mock('../../../../services/storage', () => ({
  asyncStorageDocumentsService: {
    getDocuments: jest.fn(),
    saveDocuments: jest.fn(),
  },
}));

const localDocument: Document = {
  ID: 'local-document',
  Title: 'Local document',
};

const remoteDocument: Document = {
  ID: 'remote-document',
  Title: 'Remote document',
};

const storedDocuments: StoredDocuments = {
  localDocuments: [localDocument],
  remoteDocuments: [remoteDocument],
};

const createStorageService = (): jest.Mocked<DocumentsStorageService> => ({
  getDocuments: jest.fn().mockResolvedValue(storedDocuments),
  saveDocuments: jest.fn().mockResolvedValue(undefined),
});

const createWrapper = (storageService: DocumentsStorageService) =>
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <DocumentsProvider storageService={storageService}>
        {children}
      </DocumentsProvider>
    );
  };

describe('DocumentsProvider', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('hydrates local and remote documents from storage', async () => {
    // Arrange
    const storageService = createStorageService();

    // Act
    const { result } = await renderHook(() => useDocuments(), {
      wrapper: createWrapper(storageService),
    });

    // Assert
    await waitFor(() => expect(result.current.isHydrating).toBe(false));
    expect(result.current.documents).toEqual([localDocument, remoteDocument]);
    expect(result.current.storageError).toBeNull();
    expect(storageService.getDocuments).toHaveBeenCalledTimes(1);
  });

  it('adds a local document and persists the resulting state', async () => {
    // Arrange
    const storageService = createStorageService();
    storageService.getDocuments.mockResolvedValue({
      localDocuments: [],
      remoteDocuments: [remoteDocument],
    });
    const dateNowSpy = jest
      .spyOn(Date.prototype, 'toISOString')
      .mockReturnValue('2026-08-16T10:00:00.000Z');
    const nowSpy = jest.spyOn(Date, 'now').mockReturnValue(1234);
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.5);
    const { result } = await renderHook(() => useDocuments(), {
      wrapper: createWrapper(storageService),
    });
    await waitFor(() => expect(result.current.isHydrating).toBe(false));
    await waitFor(() =>
      expect(storageService.saveDocuments).toHaveBeenCalled(),
    );
    storageService.saveDocuments.mockClear();

    // Act
    await act(async () => {
      result.current.addLocalDocument({
        title: 'New document',
        version: '2.0.0',
        attachmentName: 'report.pdf',
      });
    });

    // Assert
    const createdDocument = expect.objectContaining({
      ID: 'local-1234-i',
      CreatedAt: '2026-08-16T10:00:00.000Z',
      UpdatedAt: '2026-08-16T10:00:00.000Z',
      Title: 'New document',
      Version: '2.0.0',
      Attachments: ['report.pdf'],
      Contributors: [],
    });
    expect(result.current.documents).toEqual([createdDocument, remoteDocument]);
    await waitFor(() =>
      expect(storageService.saveDocuments).toHaveBeenCalledWith({
        localDocuments: [createdDocument],
        remoteDocuments: [remoteDocument],
      }),
    );

    dateNowSpy.mockRestore();
    nowSpy.mockRestore();
    randomSpy.mockRestore();
  });

  it('exposes hydration failures without overwriting storage', async () => {
    // Arrange
    const hydrationError = new Error('Storage unavailable');
    const storageService = createStorageService();
    storageService.getDocuments.mockRejectedValue(hydrationError);

    // Act
    const { result } = await renderHook(() => useDocuments(), {
      wrapper: createWrapper(storageService),
    });

    // Assert
    await waitFor(() => expect(result.current.isHydrating).toBe(false));
    expect(result.current.documents).toEqual([]);
    expect(result.current.storageError).toBe(hydrationError);
    expect(storageService.saveDocuments).not.toHaveBeenCalled();
  });

  it('exposes persistence failures after hydration', async () => {
    // Arrange
    const persistenceError = new Error('Unable to persist documents');
    const storageService = createStorageService();
    storageService.saveDocuments.mockRejectedValue(persistenceError);

    // Act
    const { result } = await renderHook(() => useDocuments(), {
      wrapper: createWrapper(storageService),
    });

    // Assert
    await waitFor(() =>
      expect(result.current.storageError).toBe(persistenceError),
    );
  });
});
