/* eslint-disable prettier/prettier */
// src/navigation/AppNavigator.tsx

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginForm from '../components/LoginForm';
import WorksiteSelection from '../components/WorksiteSelection';
import WorksiteDetails from '../components/WorksiteDetails';

export type RootStackParamList = {
  Login: undefined;
  WorksiteSelection: undefined;
  WorksiteDetails: { customer: any; worksite: any; };
  // add other routes here
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginForm} />
        <Stack.Screen name="WorksiteSelection" component={WorksiteSelection} />
        <Stack.Screen name="WorksiteDetails" component={WorksiteDetails} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
