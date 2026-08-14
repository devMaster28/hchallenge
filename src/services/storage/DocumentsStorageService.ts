import type { Document } from '../../features/documents/models/document';

export interface StoredDocuments {
  localDocuments: Document[];
  remoteDocuments: Document[];
}

export interface DocumentsStorageService {
  getDocuments: () => Promise<StoredDocuments>;
  saveDocuments: (documents: StoredDocuments) => Promise<void>;
}
