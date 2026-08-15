import type { Document } from '../models/document';
import type { StoredDocuments } from '../../../services/storage';

export interface DocumentsState extends StoredDocuments {
  isHydrated: boolean;
  hasReceivedRemoteDocuments: boolean;
  storageError: Error | null;
}

export const initialDocumentsState: DocumentsState = {
  localDocuments: [],
  remoteDocuments: [],
  isHydrated: false,
  hasReceivedRemoteDocuments: false,
  storageError: null,
};

export enum DocumentsActionType {
  Hydrate = 'hydrate',
  HydrationFailed = 'hydrationFailed',
  AddLocal = 'addLocal',
  SetRemote = 'setRemote',
  StorageFailed = 'storageFailed',
}

export const documentsActions = {
  hydrate: (documents: StoredDocuments) => ({
    type: DocumentsActionType.Hydrate as const,
    payload: documents,
  }),
  hydrationFailed: (error: Error) => ({
    type: DocumentsActionType.HydrationFailed as const,
    payload: error,
  }),
  addLocal: (document: Document) => ({
    type: DocumentsActionType.AddLocal as const,
    payload: document,
  }),
  setRemote: (documents: Document[]) => ({
    type: DocumentsActionType.SetRemote as const,
    payload: documents,
  }),
  storageFailed: (error: Error) => ({
    type: DocumentsActionType.StorageFailed as const,
    payload: error,
  }),
};

type DocumentsAction = ReturnType<
  (typeof documentsActions)[keyof typeof documentsActions]
>;

export const documentsReducer = (
  state: DocumentsState,
  action: DocumentsAction,
): DocumentsState => {
  switch (action.type) {
    case DocumentsActionType.Hydrate:
      return {
        ...state,
        localDocuments: [
          ...state.localDocuments,
          ...action.payload.localDocuments,
        ],
        remoteDocuments: state.hasReceivedRemoteDocuments
          ? state.remoteDocuments
          : action.payload.remoteDocuments,
        isHydrated: true,
        storageError: null,
      };
    case DocumentsActionType.HydrationFailed:
      return {
        ...state,
        isHydrated: true,
        storageError: action.payload,
      };
    case DocumentsActionType.AddLocal:
      return {
        ...state,
        localDocuments: [action.payload, ...state.localDocuments],
      };
    case DocumentsActionType.SetRemote:
      return {
        ...state,
        remoteDocuments: action.payload,
        hasReceivedRemoteDocuments: true,
      };
    case DocumentsActionType.StorageFailed:
      return {
        ...state,
        storageError: action.payload,
      };
  }
};

export const selectDocuments = (state: DocumentsState): Document[] => [
  ...state.localDocuments,
  ...state.remoteDocuments,
];
