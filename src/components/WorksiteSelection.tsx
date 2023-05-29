/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

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
      const db = getFirestore();
      const querySnapshot = await getDocs(collection(db, 'customers'));
      setCustomers(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    fetchCustomers();
  }, []);

  useEffect(() => {
    const fetchWorksites = async () => {
      const db = getFirestore();
      const querySnapshot = await getDocs(collection(db, 'worksites'));
      setWorksites(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    fetchWorksites();
  }, []);

  const handleCustomerChange = (value: any) => {
    const selected = customers.find((customer) => customer.id === value);
    setSelectedCustomer(selected);
  };

  const handleWorksiteChange = (value: any) => {
    const selected = worksites.find((worksite) => worksite.id === value);
    setSelectedWorksite(selected);
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
          selectedValue={selectedCustomer?.id}
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
          selectedValue={selectedWorksite?.id}
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
        <Text style={styles.buttonText}>Tallenna valinta</Text>
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
    fontSize: 20,
    textAlign: 'center',
  },
  pickerContainer: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'gray',
    backgroundColor: 'white',
    borderRadius: 5,
  },
  picker: {
    height: 50,
  },
  buttonContainer: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'gray',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
  },
});

export default WorksiteSelection;
