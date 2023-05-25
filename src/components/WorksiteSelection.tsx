/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker';
import { Button, View } from 'react-native';

const WorksiteSelection: React.FC = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [worksites, setWorksites] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any>({});
  const [selectedWorksite, setSelectedWorksite] = useState<any>({});

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

  const handleCustomerChange = (customer: any) => {
    setSelectedCustomer(customer);
  };

  const handleWorksiteChange = (worksite: any) => {
    setSelectedWorksite(worksite);
  };

  return (
    <View>
      <Picker
        selectedValue={selectedCustomer}
        onValueChange={(itemValue, itemIndex) =>
          handleCustomerChange(customers[itemIndex])
        }
      >
        {customers.map((customer) => (
          <Picker.Item key={customer.id} label={customer.name} value={customer.id} />
        ))}
      </Picker>

      <Picker
        selectedValue={selectedWorksite}
        onValueChange={(itemValue, itemIndex) =>
          handleWorksiteChange(worksites.filter((worksite) => worksite.customerId === selectedCustomer.id)[itemIndex])
        }
      >
        {worksites
          .filter((worksite) => worksite.customerId === selectedCustomer.id)
          .map((worksite) => (
            <Picker.Item key={worksite.id} label={worksite.name} value={worksite.id} />
          ))}
      </Picker>
      <Button title="Valitse työmaa" onPress={() => {}} />
    </View>
  );
};

export default WorksiteSelection;
