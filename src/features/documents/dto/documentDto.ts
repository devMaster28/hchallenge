import {
  parseArray,
  parseNullableString,
  parseObject,
  parseOptionalArray,
  parseOptionalString,
} from '../../../utils/validation';
import type { Contributor, Document } from '../models/document';

const parseContributorDto = (value: unknown, property: string): Contributor => {
  const contributor = parseObject(value, property);

  return {
    ID: parseOptionalString(contributor.ID, `${property}.ID`),
    Name: parseOptionalString(contributor.Name, `${property}.Name`),
  };
};

const parseNullableContributorDto = (
  value: unknown,
  property: string,
): Contributor | null =>
  value === null ? null : parseContributorDto(value, property);

export const parseDocumentDto = (
  value: unknown,
  property = 'document',
): Document => {
  const document = parseObject(value, property);

  return {
    ID: parseOptionalString(document.ID, `${property}.ID`),
    CreatedAt: parseOptionalString(document.CreatedAt, `${property}.CreatedAt`),
    UpdatedAt: parseOptionalString(document.UpdatedAt, `${property}.UpdatedAt`),
    Title: parseOptionalString(document.Title, `${property}.Title`),
    Attachments: parseOptionalArray(
      document.Attachments,
      `${property}.Attachments`,
      parseNullableString,
    ),
    Contributors: parseOptionalArray(
      document.Contributors,
      `${property}.Contributors`,
      parseNullableContributorDto,
    ),
    Version: parseOptionalString(document.Version, `${property}.Version`),
  };
};

export const parseDocumentsResponse = (value: unknown): Document[] =>
  parseArray(value, 'documents', parseDocumentDto);
