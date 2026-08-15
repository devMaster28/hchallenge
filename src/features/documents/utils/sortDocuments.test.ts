import type { Document } from '../models/document';
import { DocumentSortOption } from '../models/document';
import { sortDocuments } from './sortDocuments';

const documents: Document[] = [
  {
    ID: 'first',
    CreatedAt: '2026-01-01T00:00:00.000Z',
    Title: 'Zulu',
    Version: '2.9.0',
  },
  {
    ID: 'second',
    CreatedAt: '2026-03-01T00:00:00.000Z',
    Title: 'Alpha',
    Version: '2.10.0',
  },
  {
    ID: 'third',
    CreatedAt: null,
    Title: null,
    Version: null,
  },
];

const documentIds = (value: Document[]) => value.map(document => document.ID);

describe('sortDocuments', () => {
  it('orders valid dates from newest to oldest and leaves missing dates last', () => {
    // Arrange
    const originalOrder = documentIds(documents);

    // Act
    const result = sortDocuments(documents, DocumentSortOption.Date);

    // Assert
    expect(documentIds(result)).toEqual(['second', 'first', 'third']);
    expect(result).not.toBe(documents);
    expect(documentIds(documents)).toEqual(originalOrder);
  });

  it('orders versions numerically from highest to lowest', () => {
    // Act
    const result = sortDocuments(documents, DocumentSortOption.Version);

    // Assert
    expect(documentIds(result)).toEqual(['second', 'first', 'third']);
  });

  it('orders titles alphabetically and leaves missing titles last', () => {
    // Act
    const result = sortDocuments(documents, DocumentSortOption.Alphabetical);

    // Assert
    expect(documentIds(result)).toEqual(['second', 'first', 'third']);
  });
});
