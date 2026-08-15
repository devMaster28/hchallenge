import { compareDesc, isValid, parseISO } from 'date-fns';

import type { Document } from '../models/document';
import { DocumentSortOption } from '../models/document';

const parseValidDate = (value?: string | null): Date | null => {
  if (!value) {
    return null;
  }

  const date = parseISO(value);
  return isValid(date) ? date : null;
};

const compareByDate = (first: Document, second: Document): number => {
  const firstDate = parseValidDate(first.CreatedAt);
  const secondDate = parseValidDate(second.CreatedAt);

  if (!firstDate) {
    return secondDate ? 1 : 0;
  }

  if (!secondDate) {
    return -1;
  }

  return compareDesc(firstDate, secondDate);
};

const compareByVersion = (first: Document, second: Document): number => {
  const firstVersion = first.Version?.trim();
  const secondVersion = second.Version?.trim();

  if (!firstVersion) {
    return secondVersion ? 1 : 0;
  }

  if (!secondVersion) {
    return -1;
  }

  return secondVersion.localeCompare(firstVersion, undefined, {
    numeric: true,
    sensitivity: 'base',
  });
};

const compareAlphabetically = (first: Document, second: Document): number => {
  const firstTitle = first.Title?.trim();
  const secondTitle = second.Title?.trim();

  if (!firstTitle) {
    return secondTitle ? 1 : 0;
  }

  if (!secondTitle) {
    return -1;
  }

  return firstTitle.localeCompare(secondTitle, undefined, {
    sensitivity: 'base',
  });
};

export const sortDocuments = (
  documents: Document[],
  option: DocumentSortOption,
): Document[] => {
  const sortedDocuments = [...documents];

  switch (option) {
    case DocumentSortOption.Date:
      return sortedDocuments.sort(compareByDate);
    case DocumentSortOption.Version:
      return sortedDocuments.sort(compareByVersion);
    case DocumentSortOption.Alphabetical:
      return sortedDocuments.sort(compareAlphabetically);
  }
};
