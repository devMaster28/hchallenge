import type { Document } from '../models/document';
import {
  documentsActions,
  documentsReducer,
  initialDocumentsState,
  selectDocuments,
} from './documentsReducer';

const localDocument: Document = {
  ID: 'local-document',
  CreatedAt: '2026-01-02T00:00:00.000Z',
  Title: 'Local document',
};

const remoteDocument: Document = {
  ID: 'remote-document',
  CreatedAt: '2026-01-01T00:00:00.000Z',
  Title: 'Remote document',
};

describe('documentsReducer', () => {
  it('hydrates local and remote documents from storage', () => {
    // Arrange
    const action = documentsActions.hydrate({
      localDocuments: [localDocument],
      remoteDocuments: [remoteDocument],
    });

    // Act
    const state = documentsReducer(initialDocumentsState, action);

    // Assert
    expect(state.localDocuments).toEqual([localDocument]);
    expect(state.remoteDocuments).toEqual([remoteDocument]);
    expect(state.isHydrated).toBe(true);
  });

  it('adds local documents without replacing remote documents', () => {
    // Arrange
    const currentState = {
      ...initialDocumentsState,
      remoteDocuments: [remoteDocument],
    };
    const action = documentsActions.addLocal(localDocument);

    // Act
    const state = documentsReducer(currentState, action);

    // Assert
    expect(state.localDocuments).toEqual([localDocument]);
    expect(state.remoteDocuments).toEqual([remoteDocument]);
  });

  it('replaces only the remote snapshot', () => {
    // Arrange
    const currentState = {
      ...initialDocumentsState,
      localDocuments: [localDocument],
    };
    const action = documentsActions.setRemote([remoteDocument]);

    // Act
    const state = documentsReducer(currentState, action);

    // Assert
    expect(state.localDocuments).toEqual([localDocument]);
    expect(state.remoteDocuments).toEqual([remoteDocument]);
  });

  it('does not overwrite a fresh remote response during late hydration', () => {
    // Arrange
    const cachedRemoteDocument: Document = { ID: 'cached-remote-document' };
    const currentState = {
      ...initialDocumentsState,
      remoteDocuments: [remoteDocument],
      hasReceivedRemoteDocuments: true,
    };
    const action = documentsActions.hydrate({
      localDocuments: [],
      remoteDocuments: [cachedRemoteDocument],
    });

    // Act
    const hydratedState = documentsReducer(currentState, action);

    // Assert
    expect(hydratedState.remoteDocuments).toEqual([remoteDocument]);
  });

  it('keeps local documents created before hydration finishes', () => {
    // Arrange
    const cachedLocalDocument: Document = { ID: 'cached-local-document' };
    const currentState = {
      ...initialDocumentsState,
      localDocuments: [localDocument],
    };
    const action = documentsActions.hydrate({
      localDocuments: [cachedLocalDocument],
      remoteDocuments: [],
    });

    // Act
    const hydratedState = documentsReducer(currentState, action);

    // Assert
    expect(hydratedState.localDocuments).toEqual([
      localDocument,
      cachedLocalDocument,
    ]);
  });
});

describe('selectDocuments', () => {
  it('keeps local documents first and preserves the remote order', () => {
    // Arrange
    const firstRemoteDocument: Document = {
      ...remoteDocument,
      ID: 'first-remote-document',
      CreatedAt: '2025-01-01T00:00:00.000Z',
    };
    const secondRemoteDocument: Document = {
      ...remoteDocument,
      ID: 'second-remote-document',
      CreatedAt: '2026-01-01T00:00:00.000Z',
    };
    const state = {
      ...initialDocumentsState,
      localDocuments: [localDocument],
      remoteDocuments: [firstRemoteDocument, secondRemoteDocument],
    };

    // Act
    const documents = selectDocuments(state);

    // Assert
    expect(documents).toEqual([
      localDocument,
      firstRemoteDocument,
      secondRemoteDocument,
    ]);
  });
});
