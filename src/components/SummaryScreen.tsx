/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';

type SummaryScreenRouteProp = RouteProp<RootStackParamList, 'SummaryScreen'>;

type Props = {
  route: SummaryScreenRouteProp;
};

const SummaryScreen: React.FC<Props> = ({ route }) => {
  const { selectedTools, selectedMaterials, arrivalTime, departureTime, customer, worksite } = route.params;

  const [comments, setComments] = useState('');

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    };
    const date = new Date(dateString);
    return date.toLocaleDateString('fi-FI', options);
  };

  const handleSave = () => {
    // handle saving the data and comments
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.headerText}>Valittu asiakas: {customer.name}</Text>
        <Text style={styles.headerText}>Valittu työmaa: {worksite.name}</Text>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.subHeaderText}>Työkalut</Text>
        {selectedTools.map((tool, index) => (
          <View key={index} style={styles.itemContainer}>
            <Text style={styles.itemText}>{tool.name}: {tool.quantity} kpl</Text>
          </View>
        ))}
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.subHeaderText}>Materiaalit</Text>
        {selectedMaterials.map((material, index) => (
          <View key={index} style={styles.itemContainer}>
            <Text style={styles.itemText}>{material.name}: {material.quantity} kpl</Text>
          </View>
        ))}
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.subHeaderText}>Saapumisaika:   {formatDate(arrivalTime)}</Text>
        <Text style={styles.subHeaderText}>Lähtöaika:           {formatDate(departureTime)}</Text>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.subHeaderText}>Kommentit:</Text>
        <TextInput
          style={styles.input}
          value={comments}
          onChangeText={setComments}
          placeholder="Kirjoita kommentteja tässä..."
          multiline
          numberOfLines={4}
        />
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.noteText}>Kun olet tarkistanut asettamasi työmaatiedot, paina "Tallenna valinnat". Tämä tallentaa tiedot laskutusta varten eikä niitä voi enää muokata.</Text>

        <TouchableOpacity style={styles.buttonContainer} onPress={handleSave}>
          <Text style={styles.buttonText}>Tallenna valinnat</Text>
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
  titleContainer: {
    alignItems: 'center',
    marginBottom: 30,
    paddingTop: 20,
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
  subHeaderText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemContainer: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    paddingVertical: 5,
  },
  itemText: {
    fontSize: 16,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    textAlignVertical: 'top',
  },
  noteText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
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

export default SummaryScreen;
