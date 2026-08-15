import { buildLocalNotification } from './buildLocalNotification';

describe('buildLocalNotification', () => {
  it('maps a socket notification to native notification content', () => {
    // Arrange
    const notification = {
      DocumentID: 'document-id',
      DocumentTitle: 'Invoice',
      UserID: 'user-id',
      UserName: 'Ada',
    };
    const expected = {
      id: 'document-created',
      title: 'New document',
      body: 'Ada created “Invoice”',
      data: {
        documentId: 'document-id',
        userId: 'user-id',
      },
    };

    // Act
    const result = buildLocalNotification(notification);

    // Assert
    expect(result).toEqual(expected);
  });

  it('handles missing optional socket data', () => {
    // Arrange
    const notification = {};
    const expected = {
      id: 'document-created',
      title: 'New document',
      body: 'A new document was created',
      data: {},
    };

    // Act
    const result = buildLocalNotification(notification);

    // Assert
    expect(result).toEqual(expected);
  });
});
