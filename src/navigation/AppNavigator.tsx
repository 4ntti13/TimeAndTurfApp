/* eslint-disable prettier/prettier */
// src/navigation/AppNavigator.tsx

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginForm from '../components/LoginForm';
import WorksiteSelection from '../components/WorksiteSelection';
import WorksiteDetails from '../components/WorksiteDetails';
import MaterialEntry from '../components/MaterialEntry';
import QuantityEntry from '../components/QuantityEntry';

export type RootStackParamList = {
  Login: undefined;
  WorksiteSelection: undefined;
  WorksiteDetails: { customer: any; worksite: any; };
  MaterialEntry: {
    customer: { name: string };
    worksite: { name: string };
    arrivalTime: string;
    departureTime: string;
    selectedTools: { id: string; quantity: number; }[];
    selectedMaterials: { id: string; quantity: number; }[];
  };
  QuantityEntry: {
    selectedTools: { id: string; quantity: number; }[];
    selectedMaterials: { id: string; quantity: number; }[];
    selectedToolNames: string[];
    selectedMaterialNames: string[];
  };
};
const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginForm} />
        <Stack.Screen name="WorksiteSelection" component={WorksiteSelection} />
        <Stack.Screen name="WorksiteDetails" component={WorksiteDetails} />
        <Stack.Screen name="MaterialEntry" component={MaterialEntry} />
        <Stack.Screen name="QuantityEntry" component={QuantityEntry} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
