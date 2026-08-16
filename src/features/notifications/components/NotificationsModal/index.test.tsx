import { render } from '@testing-library/react-native';

import type { DocumentNotification } from '../../models/notification';
import NotificationsModal from './index';

jest.mock('../../../../utils/date', () => ({
  formatRelativeDate: (value?: string | null) => (value ? '1 day ago' : null),
}));

const notification: DocumentNotification = {
  Timestamp: '2026-08-15T10:00:00.000Z',
  UserID: 'user-1',
  UserName: 'Ada Lovelace',
  DocumentID: 'document-1',
  DocumentTitle: 'Annual report',
};

describe('NotificationsModal', () => {
  it('renders a received document notification', async () => {
    // Arrange & Act
    const screen = await render(
      <NotificationsModal
        notifications={[notification]}
        onClose={jest.fn()}
        visible
      />,
    );

    // Assert
    expect(
      screen.getByRole('header', { name: 'Notifications' }),
    ).toBeOnTheScreen();
    expect(screen.getByText('Annual report')).toBeOnTheScreen();
    expect(screen.getByText('Created by Ada Lovelace')).toBeOnTheScreen();
    expect(screen.getByText('1 day ago')).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Close' })).toBeOnTheScreen();
  });

  it('renders safe fallbacks when notification data is missing', async () => {
    // Arrange
    const incompleteNotification: DocumentNotification = {};

    // Act
    const screen = await render(
      <NotificationsModal
        notifications={[incompleteNotification]}
        onClose={jest.fn()}
        visible
      />,
    );

    // Assert
    expect(screen.getByText('New document')).toBeOnTheScreen();
    expect(screen.getByText('Created by another user')).toBeOnTheScreen();
    expect(screen.queryByText('1 day ago')).not.toBeOnTheScreen();
    expect(screen.queryByText('No notifications yet')).not.toBeOnTheScreen();
  });

  it('renders long notification text so it can wrap inside the card', async () => {
    // Arrange
    const longDocumentTitle = 'Consolidated annual financial report '
      .repeat(12)
      .trim();
    const longUserName = 'Alexandra Very Long Contributor Name '
      .repeat(10)
      .trim();
    const longNotification: DocumentNotification = {
      ...notification,
      DocumentTitle: longDocumentTitle,
      UserName: longUserName,
    };

    // Act
    const screen = await render(
      <NotificationsModal
        notifications={[longNotification]}
        onClose={jest.fn()}
        visible
      />,
    );

    // Assert
    expect(screen.getByText(longDocumentTitle)).toBeOnTheScreen();
    expect(screen.getByText(`Created by ${longUserName}`)).toBeOnTheScreen();
    expect(screen.getByText('1 day ago')).toBeOnTheScreen();
  });

  it('renders the empty state when there are no notifications', async () => {
    // Arrange & Act
    const screen = await render(
      <NotificationsModal notifications={[]} onClose={jest.fn()} visible />,
    );

    // Assert
    expect(screen.getByText('No notifications yet')).toBeOnTheScreen();
    expect(
      screen.getByText('New document notifications will appear here.'),
    ).toBeOnTheScreen();
  });
});
