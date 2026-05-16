import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import CrosswordScreen from '../screens/CrosswordScreen';
import ShopScreen from '../screens/ShopScreen';

export type RootStackParamList = {
  Home: undefined;
  Crossword: { crosswordId: string };
  Shop: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: '#1a237e' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Кросворди' }} />
        <Stack.Screen name="Crossword" component={CrosswordScreen} options={{ title: 'Кросворд' }} />
        <Stack.Screen name="Shop" component={ShopScreen} options={{ title: 'Магазин' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
