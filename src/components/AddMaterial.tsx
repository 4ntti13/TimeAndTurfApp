/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { addDoc, collection, getFirestore } from 'firebase/firestore';

declare let alert: (message?: any) => void;

const AddMaterial: React.FC = () => {
  const [materialName, setMaterialName] = useState('');

  const handleAddMaterial = async () => {
    const db = getFirestore();
    try {
      await addDoc(collection(db, 'materials'), { name: materialName });
      alert('Materiaali lisätty onnistuneesti!');
    } catch (error) {
      console.error('Materiaalia ei voitu lisätä!: ', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.headerText}>Lisää uusi materiaali</Text>
      </View>
      <Text style={styles.label}>Materiaalin Nimi:</Text>
      <TextInput
        style={styles.input}
        value={materialName}
        onChangeText={setMaterialName}
      />
      <TouchableOpacity style={styles.buttonContainer} onPress={handleAddMaterial}>
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

export default AddMaterial;
