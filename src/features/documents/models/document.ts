import type { OptionalNullableFields } from '../../../types/utility';

export enum ViewMode {
  List = 'list',
  Grid = 'grid',
}

export enum DocumentSortOption {
  Date = 'date',
  Version = 'version',
  Alphabetical = 'alphabetical',
}

interface ContributorContract {
  ID: string;
  Name: string;
}

interface DocumentContract {
  ID: string;
  CreatedAt: string;
  UpdatedAt: string;
  Title: string;
  Attachments: Array<string | null>;
  Contributors: Array<Contributor | null>;
  Version: string;
}

export type Contributor = OptionalNullableFields<ContributorContract>;
export type Document = OptionalNullableFields<DocumentContract>;

export interface CreateDocumentInput {
  title: string;
  version: string;
  attachmentName: string;
}
