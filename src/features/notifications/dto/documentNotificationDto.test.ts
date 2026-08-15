import { parseDocumentNotificationDto } from './documentNotificationDto';

describe('parseDocumentNotificationDto', () => {
  it('parses a notification emitted by the server', () => {
    // Arrange
    const notification = {
      Timestamp: '2026-08-14T10:00:00.000Z',
      UserID: 'user-id',
      UserName: 'Alicia Wolf',
      DocumentID: 'document-id',
      DocumentTitle: 'Annual report',
    };
    const message = JSON.stringify(notification);

    // Act
    const result = parseDocumentNotificationDto(message);

    // Assert
    expect(result).toEqual(notification);
  });

  it('accepts missing contract properties', () => {
    // Arrange
    const message = JSON.stringify({ DocumentTitle: 'Annual report' });
    const expected = {
      Timestamp: undefined,
      UserID: undefined,
      UserName: undefined,
      DocumentID: undefined,
      DocumentTitle: 'Annual report',
    };

    // Act
    const result = parseDocumentNotificationDto(message);

    // Assert
    expect(result).toEqual(expected);
  });

  it('rejects malformed JSON', () => {
    // Arrange
    const message = '{invalid';

    // Act
    const parse = () => parseDocumentNotificationDto(message);

    // Assert
    expect(parse).toThrow('Notification message must contain valid JSON');
  });

  it('rejects properties with an unexpected type', () => {
    // Arrange
    const message = JSON.stringify({ UserName: 42 });

    // Act
    const parse = () => parseDocumentNotificationDto(message);

    // Assert
    expect(parse).toThrow(
      'notification.UserName must be a string, null or undefined',
    );
  });
});
