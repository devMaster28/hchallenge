export enum ViewMode {
  List = 'list',
  Grid = 'grid',
}

type OptionalNullableFields<T> = {
  [Property in keyof T]?: T[Property] | null;
};

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
