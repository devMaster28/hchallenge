import { render } from '@testing-library/react-native';

import { ViewMode } from '../../models/document';
import type { Document } from '../../models/document';
import DocumentCard from './index';

jest.mock('../../../../utils/date', () => ({
  formatRelativeDate: (value?: string | null) => (value ? '1 day ago' : null),
}));

const document: Document = {
  ID: 'document-1',
  CreatedAt: '2026-08-15T10:00:00.000Z',
  Title: 'Annual report',
  Version: '2.0.0',
  Contributors: [
    { ID: 'contributor-1', Name: 'Ada Lovelace' },
    { ID: 'contributor-2', Name: 'Grace Hopper' },
  ],
  Attachments: ['annual-report.pdf', 'summary.xlsx'],
};

describe('DocumentCard', () => {
  it('renders all the document information in list mode', async () => {
    // Arrange & Act
    const screen = await render(<DocumentCard document={document} />);

    // Assert
    expect(screen.getByLabelText('Annual report')).toBeOnTheScreen();
    expect(screen.getByText('Annual report')).toBeOnTheScreen();
    expect(screen.getByText('Version 2.0.0')).toBeOnTheScreen();
    expect(screen.getByText('1 day ago')).toBeOnTheScreen();
    expect(screen.getByText('Ada Lovelace')).toBeOnTheScreen();
    expect(screen.getByText('Grace Hopper')).toBeOnTheScreen();
    expect(screen.getByText('annual-report.pdf')).toBeOnTheScreen();
    expect(screen.getByText('summary.xlsx')).toBeOnTheScreen();
    expect(
      screen.getByRole('button', { name: 'Share Annual report' }),
    ).toBeOnTheScreen();
  });

  it('renders safe fallback values when optional data is missing', async () => {
    // Arrange
    const documentWithoutOptionalData: Document = {};

    // Act
    const screen = await render(
      <DocumentCard document={documentWithoutOptionalData} />,
    );

    // Assert
    expect(screen.getByText('Untitled document')).toBeOnTheScreen();
    expect(screen.getByText('No version')).toBeOnTheScreen();
    expect(screen.getByText('Date unavailable')).toBeOnTheScreen();
    expect(screen.getAllByText('—')).toHaveLength(2);
    expect(
      screen.getByRole('button', { name: 'Share Untitled document' }),
    ).toBeOnTheScreen();
  });

  it('constrains long grid metadata while keeping it accessible', async () => {
    // Arrange
    const longTitle = 'Quarterly financial projection '.repeat(12).trim();
    const longVersion = `2026.${'1234567890'.repeat(12)}`;
    const documentWithLongValues: Document = {
      ...document,
      Title: longTitle,
      Version: longVersion,
    };

    // Act
    const screen = await render(
      <DocumentCard
        document={documentWithLongValues}
        variant={ViewMode.Grid}
      />,
    );

    // Assert
    expect(screen.getByText(longTitle)).toHaveProp('numberOfLines', 2);
    expect(screen.getByText(`Version ${longVersion}`)).toHaveProp(
      'numberOfLines',
      1,
    );
    expect(screen.getByText('1 day ago')).toHaveProp('numberOfLines', 1);
    expect(
      screen.getByRole('button', { name: `Share ${longTitle}` }),
    ).toBeOnTheScreen();
    expect(screen.queryByText('Contributors')).not.toBeOnTheScreen();
    expect(screen.queryByText('Attachments')).not.toBeOnTheScreen();
  });

  it('renders long contributor and attachment values in list mode', async () => {
    // Arrange
    const longContributor = 'Alexandra Very Long Contributor Name '
      .repeat(10)
      .trim();
    const longAttachment = `${'consolidated-financial-report-'.repeat(10)}.pdf`;
    const documentWithLongDetails: Document = {
      ...document,
      Contributors: [{ ID: 'long-contributor', Name: longContributor }],
      Attachments: [longAttachment],
    };

    // Act
    const screen = await render(
      <DocumentCard document={documentWithLongDetails} />,
    );

    // Assert
    expect(screen.getByText(longContributor)).toBeOnTheScreen();
    expect(screen.getByText(longAttachment)).toBeOnTheScreen();
  });
});
