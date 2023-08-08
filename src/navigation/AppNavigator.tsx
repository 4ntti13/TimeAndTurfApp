/* eslint-disable prettier/prettier */
// src/navigation/AppNavigator.tsx

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginForm from '../components/LoginForm';
import AdminPage from '../components/AdminPage';
import WorksiteSelection from '../components/WorksiteSelection';
import WorksiteDetails from '../components/WorksiteDetails';
import MaterialEntry from '../components/MaterialEntry';
import ToolEntry from '../components/ToolEntry';
import QuantityEntry from '../components/QuantityEntry';
import SummaryScreen from '../components/SummaryScreen';

export type RootStackParamList = {
  Login: undefined;
  AdminPage: undefined;
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
  ToolEntry: {
    customer: { name: string };
    worksite: { name: string };
    arrivalTime: string;
    departureTime: string;
    selectedMaterials: { id: string; quantity: number; }[];
  };
  QuantityEntry: {
    selectedTools: { id: string; quantity: number; }[];
    selectedMaterials: { id: string; quantity: number; }[];
    selectedToolNames: string[];
    selectedMaterialNames: string[];
    customer: { name: string };
    worksite: { name: string };
    arrivalTime: string;
    departureTime: string;
  };
  SummaryScreen: {
    selectedTools: { name: string; quantity: string }[];
    selectedMaterials: { name: string; quantity: string }[];
    customer: { name: string };
    worksite: { name: string };
    arrivalTime: string;
    departureTime: string;
  };
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginForm} />
        <Stack.Screen name="AdminPage" component={AdminPage} />
        <Stack.Screen name="WorksiteSelection" component={WorksiteSelection} />
        <Stack.Screen name="WorksiteDetails" component={WorksiteDetails} />
        <Stack.Screen name="MaterialEntry" component={MaterialEntry} />
        <Stack.Screen name="ToolEntry" component={ToolEntry} />
        <Stack.Screen name="QuantityEntry" component={QuantityEntry} />
        <Stack.Screen name="SummaryScreen" component={SummaryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
