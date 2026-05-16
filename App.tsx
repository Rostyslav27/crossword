import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import Navigation from './src/navigation';
import { useCrosswordStore } from './src/store/useCrosswordStore';

export default function App() {
  const initCrosswords = useCrosswordStore((s) => s.init);

  useEffect(() => {
    initCrosswords();
  }, []);

  return (
    <>
      <StatusBar style="light" />
      <Navigation />
    </>
  );
}
