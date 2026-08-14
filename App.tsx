import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import DocumentsScreen from './src/features/documents/screens/DocumentsScreen';
import DocumentsProvider from './src/features/documents/state/DocumentsProvider';

export default function App() {
  return (
    <DocumentsProvider>
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" />
        <DocumentsScreen />
      </SafeAreaProvider>
    </DocumentsProvider>
  );
}
