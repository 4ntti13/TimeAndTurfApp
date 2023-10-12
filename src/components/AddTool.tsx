/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import firestore from '@react-native-firebase/firestore';

declare let alert: (message?: any) => void;

const AddTool: React.FC = () => {
  const [toolName, setToolName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleAddTool = async () => {
    try {
      await firestore().collection('tools').add({ name: toolName, category: selectedCategory });
      alert('Lisäys onnistui!');
    } catch (error) {
      console.error('Lisäyksessä tapahtui virhe!: ', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.headerText}>Lisää uusi laite</Text>
      </View>
      <Text style={styles.label}>Kategoria:</Text>
      <Picker
        selectedValue={selectedCategory}
        style={styles.input}
        onValueChange={(itemValue) => setSelectedCategory(itemValue)}
      >
        <Picker.Item label="Valitse Kategoria" value="" />
        <Picker.Item label="Koneet" value="machines" />
        <Picker.Item label="Kuorma-autot" value="trucks" />
        <Picker.Item label="Tiivistäjät" value="compactors" />
      </Picker>
      <Text style={styles.label}>Laitteen nimi:</Text>
      <TextInput
        style={styles.input}
        value={toolName}
        onChangeText={setToolName}
      />
      <TouchableOpacity style={styles.buttonContainer} onPress={handleAddTool}>
        <Text style={styles.buttonText}>Lisää</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#40E0D0',
  },
  titleContainer: {
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    marginLeft: 10,
  },
  input: {
    height: 50,
    borderColor: '#888',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: 'white',
    padding: 10,
    marginBottom: 20,
  },
  buttonContainer: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#444',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    marginVertical: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddTool;
