import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import DocumentsScreen from './src/features/documents/screens/DocumentsScreen';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <DocumentsScreen />
    </SafeAreaProvider>
  );
}
