/* eslint-disable prettier/prettier */

/* eslint-disable prettier/prettier */

/* eslint-disable prettier/prettier */
import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';

type QuantityEntryRouteProp = RouteProp<RootStackParamList, 'QuantityEntry'>;

type Props = {
  route: QuantityEntryRouteProp;
};

const QuantityEntry: React.FC<Props> = ({ route }) => {
  const { selectedTools, selectedMaterials, selectedToolNames, selectedMaterialNames } = route.params;

  // Map tool IDs to their names and quantities
  const toolDataById = selectedTools.reduce<{ [id: string]: { name: string; quantity: string } }>((map, tool, index) => {
    map[tool.id] = { name: selectedToolNames[index], quantity: String(tool.quantity) };
    return map;
  }, {});

  // Map material IDs to their names and quantities
  const materialDataById = selectedMaterials.reduce<{ [id: string]: { name: string; quantity: string } }>((map, material, index) => {
    map[material.id] = { name: selectedMaterialNames[index], quantity: String(material.quantity) };
    return map;
  }, {});

  const handleToolQuantityChange = (id: string, value: string) => {
    toolDataById[id].quantity = value;
  };

  const handleMaterialQuantityChange = (id: string, value: string) => {
    materialDataById[id].quantity = value;
  };

  return (
    <View>
      {Object.entries(toolDataById).map(([id, { name, quantity }], index) => (
        <View key={index}>
          <Text>{name}</Text>
          <TextInput
            keyboardType="numeric"
            value={quantity}
            onChangeText={(value) => handleToolQuantityChange(id, value)}
          />
        </View>
      ))}
      {Object.entries(materialDataById).map(([id, { name, quantity }], index) => (
        <View key={index}>
          <Text>{name}</Text>
          <TextInput
            keyboardType="numeric"
            value={quantity}
            onChangeText={(value) => handleMaterialQuantityChange(id, value)}
          />
        </View>
      ))}
    </View>
  );
};
export default QuantityEntry;
