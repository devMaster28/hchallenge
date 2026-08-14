import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react';

import { asyncStorageDocumentsService } from '../../../../services/storage';
import type { DocumentsStorageService } from '../../../../services/storage';
import type { CreateDocumentInput, Document } from '../../models/document';
import {
  documentsActions,
  documentsReducer,
  initialDocumentsState,
  selectDocuments,
} from '../documentsReducer';

interface DocumentsContextValue {
  documents: Document[];
  isHydrating: boolean;
  storageError: Error | null;
  addLocalDocument: (document: CreateDocumentInput) => void;
  setRemoteDocuments: (documents: Document[]) => void;
}

interface DocumentsProviderProps {
  children: ReactNode;
  storageService?: DocumentsStorageService;
}

const DocumentsContext = createContext<DocumentsContextValue | null>(null);

export default function DocumentsProvider({
  children,
  storageService = asyncStorageDocumentsService,
}: DocumentsProviderProps) {
  const [state, dispatch] = useReducer(
    documentsReducer,
    initialDocumentsState,
  );
  const canPersist = useRef(false);
  const persistenceQueue = useRef<Promise<void>>(Promise.resolve());

  useEffect(() => {
    let active = true;

    storageService
      .getDocuments()
      .then(documents => {
        if (active) {
          canPersist.current = true;
          dispatch(documentsActions.hydrate(documents));
        }
      })
      .catch(reason => {
        if (active) {
          const error =
            reason instanceof Error ? reason : new Error('Unknown error');
          dispatch(documentsActions.hydrationFailed(error));
        }
      });

    return () => {
      active = false;
    };
  }, [storageService]);

  useEffect(() => {
    if (!state.isHydrated || !canPersist.current) {
      return;
    }

    let active = true;
    const documentsToPersist = {
      localDocuments: state.localDocuments,
      remoteDocuments: state.remoteDocuments,
    };

    persistenceQueue.current = persistenceQueue.current
      .then(() => storageService.saveDocuments(documentsToPersist))
      .catch(reason => {
        if (!active) {
          return;
        }

        const error =
          reason instanceof Error ? reason : new Error('Unknown error');
        dispatch(documentsActions.storageFailed(error));
      });

    return () => {
      active = false;
    };
  }, [
    state.isHydrated,
    state.localDocuments,
    state.remoteDocuments,
    storageService,
  ]);

  const addLocalDocument = useCallback((document: CreateDocumentInput) => {
    const createdAt = new Date().toISOString();
    canPersist.current = true;

    dispatch(
      documentsActions.addLocal({
        ID: `local-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        CreatedAt: createdAt,
        UpdatedAt: createdAt,
        Title: document.title,
        Version: document.version,
        Attachments: [document.attachmentName],
        Contributors: [],
      }),
    );
  }, []);

  const setRemoteDocuments = useCallback((documents: Document[]) => {
    canPersist.current = true;
    dispatch(documentsActions.setRemote(documents));
  }, []);

  const documents = useMemo(() => selectDocuments(state), [state]);

  const value = useMemo(
    () => ({
      documents,
      isHydrating: !state.isHydrated,
      storageError: state.storageError,
      addLocalDocument,
      setRemoteDocuments,
    }),
    [
      documents,
      state.isHydrated,
      state.storageError,
      addLocalDocument,
      setRemoteDocuments,
    ],
  );

  return (
    <DocumentsContext.Provider value={value}>
      {children}
    </DocumentsContext.Provider>
  );
}

export const useDocuments = (): DocumentsContextValue => {
  const context = useContext(DocumentsContext);

  if (!context) {
    throw new Error('useDocuments must be used inside DocumentsProvider');
  }

  return context;
};
