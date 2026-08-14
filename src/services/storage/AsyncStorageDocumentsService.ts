import AsyncStorage from '@react-native-async-storage/async-storage';

import type {
  DocumentsStorageService,
  StoredDocuments,
} from './DocumentsStorageService';

const DOCUMENTS_STORAGE_KEY = '@documents';

const emptyDocuments: StoredDocuments = {
  localDocuments: [],
  remoteDocuments: [],
};

const isDocumentArray = (
  value: unknown,
): value is StoredDocuments['localDocuments'] =>
  Array.isArray(value) &&
  value.every(
    document =>
      typeof document === 'object' &&
      document !== null &&
      !Array.isArray(document),
  );

const isStoredDocuments = (value: unknown): value is StoredDocuments => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }

  const documents = value as Record<string, unknown>;
  return (
    isDocumentArray(documents.localDocuments) &&
    isDocumentArray(documents.remoteDocuments)
  );
};

export const asyncStorageDocumentsService: DocumentsStorageService = {
  async getDocuments() {
    const storedValue = await AsyncStorage.getItem(DOCUMENTS_STORAGE_KEY);

    if (!storedValue) {
      return emptyDocuments;
    }

    const documents: unknown = JSON.parse(storedValue);

    if (!isStoredDocuments(documents)) {
      throw new Error('Invalid documents stored locally');
    }

    return documents;
  },

  async saveDocuments(documents) {
    await AsyncStorage.setItem(
      DOCUMENTS_STORAGE_KEY,
      JSON.stringify(documents),
    );
  },
};
