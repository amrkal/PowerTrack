import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './LoginScreen';
import Register from './Register';
import MainPage from './MainPage';
import ItemsPage from './ItemsPage';

type RootStackParamList = {
  LoginScreen: undefined;
  Register: undefined;
  MainPage: undefined;
  ItemsPage: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const RootLayout: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName="LoginScreen">
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="MainPage" component={MainPage} />
      <Stack.Screen name="ItemsPage" component={ItemsPage} />
    </Stack.Navigator>
  );
};

export default RootLayout;
