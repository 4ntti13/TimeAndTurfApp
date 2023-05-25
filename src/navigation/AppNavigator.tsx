/* eslint-disable prettier/prettier */
// src/navigation/AppNavigator.tsx

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginForm from '../components/LoginForm';
import WorksiteSelection from '../components/WorksiteSelection';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  WorksiteSelection: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginForm} />
        <Stack.Screen name="WorksiteSelection" component={WorksiteSelection} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
