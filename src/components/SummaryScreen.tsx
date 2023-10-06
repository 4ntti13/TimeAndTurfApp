/* eslint-disable prettier/prettier */
// SummaryScreen:

import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { AuthContext } from '../contexts/AuthContext';
import firestore from '@react-native-firebase/firestore'; // Updated import
import { StackNavigationProp } from '@react-navigation/stack';
import auth from '@react-native-firebase/auth'; // Auth-moduulin tuonti

type SummaryScreenRouteProp = RouteProp<RootStackParamList, 'SummaryScreen'>;

type Props = {
  route: SummaryScreenRouteProp;
  navigation: StackNavigationProp<RootStackParamList, 'SummaryScreen'>;
};

const SummaryScreen: React.FC<Props> = ({ route, navigation }) => {
  const { selectedTools, selectedMaterials, arrivalTime, departureTime, customer, worksite, selectedDate } = route.params;
  const { user, setUser } = useContext(AuthContext);
  const [comments, setComments] = useState('');

  const formatTime = (timeString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
    };
    const time = new Date(timeString);
    return time.toLocaleTimeString('fi-FI', options);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fi-FI', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const handleSave = async () => {
    const summaryData = {
      user: user?.email,
      customer: customer.name,
      worksite: worksite.name,
      selectedTools: selectedTools,
      selectedMaterials: selectedMaterials,
      selectedDate,
      arrivalTime: arrivalTime,
      departureTime: departureTime,
      comments: comments,
    };

    try {
      await firestore().collection('summaries').add(summaryData);
      console.log('Tiedot tallennettu onnistuneesti!');

      auth().signOut().then(() => {  // Päivitetty auth().signOut() -muotoon
        console.log('User signed out successfully');
        setUser(null);
        navigation.navigate('Login');
      }).catch((error) => {
        console.log('Error signing out: ', error);
      });

    } catch (error) {
      console.error('Tietoja ei voitu tallentaa: ', error);
    }
  };


  return (
    <ScrollView style={styles.container}>
      <View style={styles.titleContainer}>
        {user && <Text style={styles.headerText}>Kirjautunut käyttäjä: {user.email}</Text>}
        <Text style={styles.headerText}>Valittu asiakas: {customer.name}</Text>
        <Text style={styles.headerText}>Valittu työmaa: {worksite.name}</Text>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.subHeaderText}>Päivämäärä:        {formatDate(selectedDate)}</Text>
        <Text style={styles.subHeaderText}>Saapumisaika:    {formatTime(arrivalTime)}</Text>
        <Text style={styles.subHeaderText}>Lähtöaika:           {formatTime(departureTime)}</Text>
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
        <Text style={styles.noteText}>Kun olet VARMASTI tarkistanut asettamasi työmaatiedot, paina "Tallenna valinnat ja lopeta". Tämä tallentaa tiedot laskutusta varten, eikä niitä voi enää muokata.</Text>

        <TouchableOpacity style={styles.buttonContainer} onPress={handleSave}>
          <Text style={styles.buttonText}>Tallenna valinnat ja lopeta</Text>
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
