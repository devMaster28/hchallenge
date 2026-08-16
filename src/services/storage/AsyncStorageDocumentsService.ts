import AsyncStorage from '@react-native-async-storage/async-storage';

import { parseDocumentDto } from '../../features/documents/dto/documentDto';
import type { Document } from '../../features/documents/models/document';
import type {
  DocumentsStorageService,
  StoredDocuments,
} from './DocumentsStorageService';

const DOCUMENTS_STORAGE_KEY = '@documents';
const DOCUMENTS_STORAGE_VERSION = 1;

interface StoredDocumentsPayload extends StoredDocuments {
  version: typeof DOCUMENTS_STORAGE_VERSION;
}

const createEmptyDocuments = (): StoredDocuments => ({
  localDocuments: [],
  remoteDocuments: [],
});

const parseStoredDocumentArray = (
  value: unknown,
  property: string,
): Document[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((document, index) => {
    try {
      return [parseDocumentDto(document, `${property}[${index}]`)];
    } catch {
      return [];
    }
  });
};

const parseStoredDocuments = (value: unknown): StoredDocuments => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return createEmptyDocuments();
  }

  const payload = value as Record<string, unknown>;

  const isLegacyPayload = payload.version === undefined;
  const isCurrentPayload = payload.version === DOCUMENTS_STORAGE_VERSION;

  if (!isLegacyPayload && !isCurrentPayload) {
    return createEmptyDocuments();
  }

  return {
    localDocuments: parseStoredDocumentArray(
      payload.localDocuments,
      'localDocuments',
    ),
    remoteDocuments: parseStoredDocumentArray(
      payload.remoteDocuments,
      'remoteDocuments',
    ),
  };
};

export const asyncStorageDocumentsService: DocumentsStorageService = {
  async getDocuments() {
    const storedValue = await AsyncStorage.getItem(DOCUMENTS_STORAGE_KEY);

    if (!storedValue) {
      return createEmptyDocuments();
    }

    try {
      return parseStoredDocuments(JSON.parse(storedValue));
    } catch {
      return createEmptyDocuments();
    }
  },

  async saveDocuments(documents) {
    const payload: StoredDocumentsPayload = {
      version: DOCUMENTS_STORAGE_VERSION,
      ...documents,
    };

    await AsyncStorage.setItem(DOCUMENTS_STORAGE_KEY, JSON.stringify(payload));
  },
};
