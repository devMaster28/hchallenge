import { act, renderHook, waitFor } from '@testing-library/react-native';

import { get } from '../../../services/network/Api';
import { endpoints } from '../../../services/network/endpoints';
import { useGetDocuments } from './useGetDocuments';

jest.mock('../../../services/network/Api', () => ({
  get: jest.fn(),
}));

const getMock = get as jest.MockedFunction<typeof get>;

const createDeferred = <Value>() => {
  let resolve!: (value: Value | PromiseLike<Value>) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<Value>((promiseResolve, promiseReject) => {
    resolve = promiseResolve;
    reject = promiseReject;
  });

  return { promise, resolve, reject };
};

const firstDocumentResponse = {
  ID: 'document-1',
  Title: 'Annual report',
  Version: '1.0.0',
};

describe('useGetDocuments', () => {
  beforeEach(() => {
    getMock.mockReset();
  });

  it('loads and parses documents from the documents endpoint', async () => {
    // Arrange
    const request = createDeferred<unknown>();
    getMock.mockReturnValue(request.promise);

    // Act
    const { result } = await renderHook(() => useGetDocuments());

    // Assert
    expect(result.current.isLoading).toBe(true);
    expect(result.current.hasFetched).toBe(false);
    expect(result.current.response).toEqual([]);
    expect(getMock).toHaveBeenCalledWith(endpoints.documents);

    // Act
    await act(async () => {
      request.resolve([firstDocumentResponse]);
    });

    // Assert
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.response).toEqual([
      {
        ID: 'document-1',
        CreatedAt: undefined,
        UpdatedAt: undefined,
        Title: 'Annual report',
        Attachments: undefined,
        Contributors: undefined,
        Version: '1.0.0',
      },
    ]);
    expect(result.current.error).toBeNull();
    expect(result.current.hasFetched).toBe(true);
  });

  it('exposes request errors and finishes loading', async () => {
    // Arrange
    const requestError = new Error('Network unavailable');
    getMock.mockRejectedValue(requestError);

    // Act
    const { result } = await renderHook(() => useGetDocuments());

    // Assert
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.response).toEqual([]);
    expect(result.current.error).toBe(requestError);
  });

  it('exposes invalid backend responses as errors', async () => {
    // Arrange
    getMock.mockResolvedValue([{ ID: 42 }]);

    // Act
    const { result } = await renderHook(() => useGetDocuments());

    // Assert
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.response).toEqual([]);
    expect(result.current.error).toEqual(
      expect.objectContaining({
        message: 'documents[0].ID must be a string, null or undefined',
      }),
    );
  });

  it('keeps the current documents while refetching and then replaces them', async () => {
    // Arrange
    const refetchRequest = createDeferred<unknown>();
    getMock
      .mockResolvedValueOnce([firstDocumentResponse])
      .mockReturnValueOnce(refetchRequest.promise);
    const { result } = await renderHook(() => useGetDocuments());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // Act
    await act(async () => {
      result.current.refetch();
    });

    // Assert
    expect(result.current.isLoading).toBe(true);
    expect(result.current.response[0]?.ID).toBe('document-1');
    expect(getMock).toHaveBeenCalledTimes(2);

    // Act
    await act(async () => {
      refetchRequest.resolve([{ ID: 'document-2', Title: 'Forecast' }]);
    });

    // Assert
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.response).toEqual([
      expect.objectContaining({ ID: 'document-2', Title: 'Forecast' }),
    ]);
  });

  it('waits for an explicit refetch when automatic fetching is disabled', async () => {
    // Arrange
    const request = createDeferred<unknown>();
    getMock.mockReturnValue(request.promise);

    // Act
    const { result } = await renderHook(() =>
      useGetDocuments({ enabled: false }),
    );

    // Assert
    expect(getMock).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.hasFetched).toBe(false);

    // Act
    await act(async () => {
      result.current.refetch();
    });

    // Assert
    expect(getMock).toHaveBeenCalledWith(endpoints.documents);
    expect(result.current.isLoading).toBe(true);

    // Act
    await act(async () => {
      request.resolve([firstDocumentResponse]);
    });

    // Assert
    await waitFor(() => expect(result.current.hasFetched).toBe(true));
    expect(result.current.response[0]?.ID).toBe('document-1');
  });
});
