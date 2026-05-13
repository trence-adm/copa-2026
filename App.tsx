import 'react-native-gesture-handler';

import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { CollectionProvider } from './src/context/CollectionContext';
import { RootTabs } from './src/navigation/RootTabs';

export default function App() {
  return (
    <SafeAreaProvider>
      <CollectionProvider>
        <StatusBar style="dark" />
        <RootTabs />
      </CollectionProvider>
    </SafeAreaProvider>
  );
}
