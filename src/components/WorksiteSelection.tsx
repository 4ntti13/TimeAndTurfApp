/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import firestore from '@react-native-firebase/firestore'; // <-- Päivitetty import

type WorksiteSelectionNavigationProp = StackNavigationProp<
  RootStackParamList,
  'WorksiteSelection'
>;

type Props = {
  navigation: WorksiteSelectionNavigationProp;
};

const WorksiteSelection: React.FC<Props> = ({ navigation }) => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [worksites, setWorksites] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [selectedWorksite, setSelectedWorksite] = useState<any>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const querySnapshot = await firestore().collection('customers').get();
        setCustomers(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error('Error fetching customers: ', error);
      }
    };

    fetchCustomers();
  }, []);

  useEffect(() => {
    const fetchWorksites = async () => {
      try {
        const querySnapshot = await firestore().collection('worksites').get();
        setWorksites(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error('Error fetching worksites: ', error);
      }
    };

    fetchWorksites();
  }, []);

  const handleCustomerChange = (value: any) => {
    if (value) {
      const selected = customers.find((customer) => customer.id === value);
      setSelectedCustomer(selected);
    }
  };

  const handleWorksiteChange = (value: any) => {
    if (value) {
      const selected = worksites.find((worksite) => worksite.id === value);
      setSelectedWorksite(selected);
    }
  };

  const handleButtonPress = () => {
    if (selectedCustomer && selectedWorksite) {
      navigation.navigate('WorksiteDetails', {
        customer: selectedCustomer,
        worksite: selectedWorksite,
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.headerText}>Valitse asiakas ja työmaa</Text>
      </View>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedCustomer?.id || ''}
          onValueChange={handleCustomerChange}
          style={styles.picker}
        >
          {customers.map((customer) => (
            <Picker.Item label={customer.name} value={customer.id} key={customer.id} />
          ))}
        </Picker>
      </View>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedWorksite?.id || ''}
          onValueChange={handleWorksiteChange}
          style={styles.picker}
          enabled={!!selectedCustomer}
        >
          {selectedCustomer && worksites
            .filter((worksite) => worksite.customerId === selectedCustomer?.id)
            .map((worksite) => (
              <Picker.Item label={worksite.name} value={worksite.id} key={worksite.id} />
            ))}
        </Picker>
      </View>
      <TouchableOpacity style={styles.buttonContainer} onPress={handleButtonPress}>
        <Text style={styles.buttonText}>Jatka</Text>
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
  pickerContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#888',
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    padding: 10,
  },
  picker: {
    height: 50,
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

export default WorksiteSelection;
