import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import DocumentsProvider from './src/features/documents/state/DocumentsProvider';
import NotificationsProvider from './src/features/notifications/state/NotificationsProvider';
import DocumentsScreen from './src/screens/DocumentsScreen';

export default function App() {
  return (
    <DocumentsProvider>
      <NotificationsProvider>
        <SafeAreaProvider>
          <StatusBar barStyle="dark-content" />
          <DocumentsScreen />
        </SafeAreaProvider>
      </NotificationsProvider>
    </DocumentsProvider>
  );
}
