import AsyncStorage from '@react-native-async-storage/async-storage';

import type { StoredDocuments } from './DocumentsStorageService';
import { asyncStorageDocumentsService } from './AsyncStorageDocumentsService';

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
  },
}));

const asyncStorageMock = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

const documents: StoredDocuments = {
  localDocuments: [
    {
      ID: 'local-document',
      Title: 'Local document',
      Version: '1.0.0',
    },
  ],
  remoteDocuments: [
    {
      ID: 'remote-document',
      Title: 'Remote document',
      Version: '2.0.0',
    },
  ],
};

describe('AsyncStorageDocumentsService', () => {
  beforeEach(() => {
    asyncStorageMock.getItem.mockReset();
    asyncStorageMock.setItem.mockReset();
  });

  it('stores documents in a versioned payload', async () => {
    // Arrange
    asyncStorageMock.setItem.mockResolvedValue(undefined);

    // Act
    await asyncStorageDocumentsService.saveDocuments(documents);

    // Assert
    expect(asyncStorageMock.setItem).toHaveBeenCalledWith(
      '@documents',
      JSON.stringify({ version: 1, ...documents }),
    );
  });

  it('validates every restored document with the backend parser', async () => {
    // Arrange
    asyncStorageMock.getItem.mockResolvedValue(
      JSON.stringify({ version: 1, ...documents }),
    );

    // Act
    const restoredDocuments = await asyncStorageDocumentsService.getDocuments();

    // Assert
    expect(restoredDocuments.localDocuments).toEqual([
      expect.objectContaining({
        ID: 'local-document',
        Title: 'Local document',
        Version: '1.0.0',
      }),
    ]);
    expect(restoredDocuments.remoteDocuments).toEqual([
      expect.objectContaining({
        ID: 'remote-document',
        Title: 'Remote document',
        Version: '2.0.0',
      }),
    ]);
  });

  it('discards corrupt documents while keeping valid entries', async () => {
    // Arrange
    asyncStorageMock.getItem.mockResolvedValue(
      JSON.stringify({
        version: 1,
        localDocuments: [documents.localDocuments[0], { Title: {} }],
        remoteDocuments: [null, documents.remoteDocuments[0]],
      }),
    );

    // Act
    const restoredDocuments = await asyncStorageDocumentsService.getDocuments();

    // Assert
    expect(restoredDocuments.localDocuments).toEqual([
      expect.objectContaining({ ID: 'local-document' }),
    ]);
    expect(restoredDocuments.remoteDocuments).toEqual([
      expect.objectContaining({ ID: 'remote-document' }),
    ]);
  });

  it('restores the previous unversioned format for migration', async () => {
    // Arrange
    asyncStorageMock.getItem.mockResolvedValue(JSON.stringify(documents));

    // Act
    const restoredDocuments = await asyncStorageDocumentsService.getDocuments();

    // Assert
    expect(restoredDocuments.localDocuments).toEqual([
      expect.objectContaining({ ID: 'local-document' }),
    ]);
    expect(restoredDocuments.remoteDocuments).toEqual([
      expect.objectContaining({ ID: 'remote-document' }),
    ]);
  });

  it.each([
    ['invalid JSON', '{invalid-json'],
    [
      'an unsupported version',
      JSON.stringify({
        version: 2,
        localDocuments: [],
        remoteDocuments: [],
      }),
    ],
  ])('recovers an empty state from %s', async (_case, storedValue) => {
    // Arrange
    asyncStorageMock.getItem.mockResolvedValue(storedValue);

    // Act
    const restoredDocuments = await asyncStorageDocumentsService.getDocuments();

    // Assert
    expect(restoredDocuments).toEqual({
      localDocuments: [],
      remoteDocuments: [],
    });
  });

  it('keeps storage access errors observable', async () => {
    // Arrange
    const storageError = new Error('AsyncStorage is unavailable');
    asyncStorageMock.getItem.mockRejectedValue(storageError);

    // Act
    const getDocuments = asyncStorageDocumentsService.getDocuments();

    // Assert
    await expect(getDocuments).rejects.toBe(storageError);
  });
});
