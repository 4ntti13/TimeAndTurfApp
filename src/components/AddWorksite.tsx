/* eslint-disable prettier/prettier */

/* eslint-disable prettier/prettier */

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { addDoc, collection, getDocs, getFirestore } from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker';

declare let alert: (message?: any) => void;

const AddWorksite: React.FC = () => {
  const [worksiteName, setWorksiteName] = useState('');
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<{ id: string, name: string } | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      const db = getFirestore();
      const customerCollection = collection(db, 'customers');
      const customerSnapshot = await getDocs(customerCollection);
      const customerList = customerSnapshot.docs.map(doc => {
        return {
          ...doc.data(),
          id: doc.id,
        };
      });
      setCustomers(customerList);
    };

    fetchCustomers();
  }, []);

  const handleAddWorksite = async () => {
    if (!selectedCustomer) {
      alert('Valitse ensin asiakas!');
      return;
    }

    if (worksiteName.trim() === '') {
      alert('Syötä työmaan nimi!');
      return;
    }

    const db = getFirestore();
    const worksitesCollection = collection(db, 'worksites');

    try {
      await addDoc(worksitesCollection, {
        name: worksiteName,
        customerId: selectedCustomer.id,
        customerName: selectedCustomer.name, // Lisätään asiakkaan nimi
      });
      alert('Työmaa lisätty onnistuneesti!');
      setWorksiteName('');
    } catch (error) {
      console.error('Error adding worksite: ', error);
      alert('Virhe työmaan lisäämisessä!');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Lisää uusi työmaa</Text>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedCustomer?.id || ''}
          onValueChange={(itemValue) => {
            const selected = customers.find(customer => customer.id === itemValue);
            if (selected) {
              setSelectedCustomer({
                id: selected.id,
                name: selected.name,
              });
            }
          }}
          style={styles.picker}
        >
          <Picker.Item label="Valitse asiakas..." value="" />
          {customers.map(customer => (
            <Picker.Item key={customer.id} label={customer.name} value={customer.id} />
          ))}
        </Picker>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Työmaan nimi"
        value={worksiteName}
        onChangeText={setWorksiteName}
      />

    <TouchableOpacity style={styles.buttonContainer} onPress={handleAddWorksite}>
        <Text style={styles.buttonText}>Lisää</Text>
    </TouchableOpacity>
 </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#40E0D0',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#444',
  },
  pickerContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#888',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
  },
  picker: {
    height: 50,
  },
  input: {
    height: 50,
    width: '100%',
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
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddWorksite;







