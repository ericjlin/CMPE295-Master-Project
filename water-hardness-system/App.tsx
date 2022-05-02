import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import {AuthProvider} from './context/AuthContext';
import {LogBox} from 'react-native';

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  LogBox.ignoreAllLogs();//Ignore all log notifications

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <AuthProvider>
        <Navigation colorScheme={colorScheme} />
        <StatusBar />
        </AuthProvider>
      </SafeAreaProvider>
    );
  }
}
