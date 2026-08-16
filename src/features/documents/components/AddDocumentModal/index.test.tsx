import { pick } from '@react-native-documents/picker';
import { fireEvent, render, waitFor } from '@testing-library/react-native';

import AddDocumentModal from './index';

jest.mock('@react-native-documents/picker', () => ({
  errorCodes: { OPERATION_CANCELED: 'OPERATION_CANCELED' },
  isErrorWithCode: jest.fn(() => false),
  pick: jest.fn(),
}));

const pickMock = pick as jest.MockedFunction<typeof pick>;

describe('AddDocumentModal', () => {
  beforeEach(() => {
    pickMock.mockReset();
    pickMock.mockResolvedValue([{ name: 'annual-report.pdf' }] as never);
  });

  it('submits a valid document and closes the modal', async () => {
    // Arrange
    const onClose = jest.fn();
    const onSubmit = jest.fn();
    const screen = await render(
      <AddDocumentModal onClose={onClose} onSubmit={onSubmit} visible />,
    );

    // Act
    await fireEvent.changeText(
      screen.getByLabelText('Document name'),
      '  Annual report  ',
    );
    await fireEvent.changeText(
      screen.getByLabelText('Document version'),
      '  2.0.0  ',
    );
    await fireEvent.press(screen.getByRole('button', { name: 'Choose file' }));
    await waitFor(() =>
      expect(screen.getByText('annual-report.pdf')).toBeOnTheScreen(),
    );
    await fireEvent.press(screen.getByRole('button', { name: 'Submit' }));

    // Assert
    expect(onSubmit).toHaveBeenCalledWith({
      title: 'Annual report',
      version: '2.0.0',
      attachmentName: 'annual-report.pdf',
    });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('keeps submit disabled while a required value is missing', async () => {
    // Arrange
    const onClose = jest.fn();
    const onSubmit = jest.fn();
    const screen = await render(
      <AddDocumentModal onClose={onClose} onSubmit={onSubmit} visible />,
    );

    // Act
    await fireEvent.changeText(
      screen.getByLabelText('Document name'),
      'Annual report',
    );

    // Assert
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    expect(submitButton).toBeDisabled();

    // Act
    await fireEvent.press(submitButton);

    // Assert
    expect(onSubmit).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
    expect(screen.getByText('Choose file')).toBeOnTheScreen();
  });

  it('renders long form values without losing or expanding constrained text', async () => {
    // Arrange
    const longTitle = 'International consolidated annual report '.repeat(12);
    const longVersion = `release-${'1234567890'.repeat(15)}`;
    const longFileName = `${'financial-report-'.repeat(15)}.pdf`;
    pickMock.mockResolvedValue([{ name: longFileName }] as never);
    const screen = await render(
      <AddDocumentModal onClose={jest.fn()} onSubmit={jest.fn()} visible />,
    );

    // Act
    await fireEvent.changeText(
      screen.getByLabelText('Document name'),
      longTitle,
    );
    await fireEvent.changeText(
      screen.getByLabelText('Document version'),
      longVersion,
    );
    await fireEvent.press(screen.getByRole('button', { name: 'Choose file' }));

    // Assert
    expect(screen.getByLabelText('Document name')).toHaveDisplayValue(
      longTitle,
    );
    expect(screen.getByLabelText('Document version')).toHaveDisplayValue(
      longVersion,
    );
    await waitFor(() =>
      expect(screen.getByText(longFileName)).toHaveProp('numberOfLines', 1),
    );
    expect(screen.getByRole('button', { name: 'Submit' })).toBeEnabled();
  });
});
