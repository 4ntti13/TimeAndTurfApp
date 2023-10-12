/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { StackNavigationProp } from '@react-navigation/stack';

type QuantityEntryRouteProp = RouteProp<RootStackParamList, 'QuantityEntry'>;
type QuantityEntryNavigationProp = StackNavigationProp<RootStackParamList, 'QuantityEntry'>;

type Props = {
  route: QuantityEntryRouteProp;
  navigation: QuantityEntryNavigationProp;
};



const QuantityEntry: React.FC<Props> = ({ route, navigation }) => {
  const { selectedTools, selectedMaterials, selectedToolNames, selectedMaterialNames, customer, worksite, arrivalTime, departureTime, selectedDate } = route.params;

  const [toolDataById, setToolDataById] = useState<{ [id: string]: { name: string; quantity: string } }>({});
  const [materialDataById, setMaterialDataById] = useState<{ [id: string]: { name: string; quantity: string } }>({});
  console.log('Selected Tool names:', selectedToolNames);
  console.log('Selected Material Names:', selectedMaterialNames);


  useEffect(() => {
    setToolDataById(
      selectedTools.reduce<{ [id: string]: { name: string; quantity: string } }>((map, tool, index) => {
        map[tool.id] = { name: selectedToolNames[index], quantity: String(tool.quantity) };
        return map;
      }, {})
    );

    setMaterialDataById(
      selectedMaterials.reduce<{ [id: string]: { name: string; quantity: string } }>((map, material, index) => {
        map[material.id] = { name: selectedMaterialNames[index], quantity: String(material.quantity) };
        return map;
      }, {})
    );
  }, [selectedMaterials, selectedMaterialNames, selectedTools, selectedToolNames]);

  const handleToolQuantityChange = (id: string, value: string) => {
    setToolDataById((prevState) => ({
      ...prevState,
      [id]: {
        ...prevState[id],
        quantity: value,
      },
    }));
  };

  const handleMaterialQuantityChange = (id: string, value: string) => {
    setMaterialDataById((prevState) => ({
      ...prevState,
      [id]: {
        ...prevState[id],
        quantity: value,
      },
    }));
  };

  const handleSaveAndContinue = () => {
    navigation.navigate('SummaryScreen', {
      selectedTools: Object.values(toolDataById),
      selectedMaterials: Object.values(materialDataById),
      selectedDate,
      arrivalTime,
      departureTime,
      customer,
      worksite,
    });
  };

  useEffect(() => {
    console.log('Initial selectedTools:', selectedTools);
    console.log('Initial selectedMaterials:', selectedMaterials);
    //...
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.headerTextSmall}>Valittu asiakas: {customer.name}</Text>
        <Text style={styles.headerTextSmall}>Valittu työmaa: {worksite.name}</Text>
      </View>
      <Text style={styles.headerText}>Aseta valittujen työkalujen/laitteiden/materiaalien lukumäärät</Text>
      <View style={styles.sectionContainer}>
        <Text style={styles.subHeaderText}>Työkalut/laitteet</Text>
        {Object.entries(toolDataById).map(([id, { name, quantity }], index) => (
          <View key={index} style={styles.itemContainer}>
            <Text style={styles.itemText}>{name}</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={quantity}
              onChangeText={(value) => handleToolQuantityChange(id, value)}
            />
          </View>
        ))}
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.subHeaderText}>Materiaalit</Text>
        {Object.entries(materialDataById).map(([id, { name, quantity }], index) => (
          <View key={index} style={styles.itemContainer}>
            <Text style={styles.itemText}>{name}</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={quantity}
              onChangeText={(value) => handleMaterialQuantityChange(id, value)}
            />
          </View>
        ))}
      </View>

      <View style={styles.sectionContainer}>
        <TouchableOpacity style={styles.buttonContainer} onPress={handleSaveAndContinue}>
          <Text style={styles.buttonText}>Tallenna ja jatka</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#40E0D0',
  },
  sectionContainer: {
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  headerTextSmall: {
    fontSize: 16,
    fontWeight: '400',  // Lighter font weight for a cleaner look
    color: '#333',  // Slightly off-black for softer appearance
    textAlign: 'left',
    marginVertical: 8,
  },

  titleContainer: {
    marginBottom: 25,
    paddingLeft: 5,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1, // Subtle shadow
    shadowRadius: 5,
    elevation: 2,
  },
  subHeaderText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemContainer: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    paddingVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemText: {
    fontSize: 16,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    width: '40%',
  },
  buttonContainer: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#444',
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default QuantityEntry;
