/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */

/* eslint-disable prettier/prettier */

/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MultiSelect from 'react-native-multiple-select';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

type MaterialEntryRouteProp = RouteProp<RootStackParamList, 'MaterialEntry'>;
type MaterialEntryNavigationProp = NavigationProp<RootStackParamList, 'MaterialEntry'>;

type Props = {
  route: MaterialEntryRouteProp;
  navigation: MaterialEntryNavigationProp;
};

const MaterialEntry: React.FC<Props> = ({ route, navigation }) => {
  const { customer, worksite, arrivalTime, departureTime } = route.params;
  const [tools, setTools] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [selectedTools, setSelectedTools] = useState<{ id: string, quantity: number }[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<{ id: string, quantity: number }[]>([]);
  const [inputValues, setInputValues] = useState<{ [id: string]: string }>({});

  const onProceed = () => {
    navigation.navigate('QuantityEntry', {
      customer,
      worksite,
      arrivalTime,
      departureTime,
      selectedTools,
      selectedMaterials,
      selectedToolNames: selectedTools.map(t => tools.find(tool => tool.id === t.id)?.name),
      selectedMaterialNames: selectedMaterials.map(m => materials.find(material => material.id === m.id)?.name),
    });
  };

  const onSelectedToolsChange = (newSelectedTools: string[]) => {
    setSelectedTools(newSelectedTools.map(id => ({ id, quantity: 0 })));
    newSelectedTools.forEach(id => {
      if (!inputValues[id]) {
        setInputValues(oldValues => ({ ...oldValues, [id]: '0' }));
      }
    });
  };

  const onSelectedMaterialsChange = (newSelectedMaterials: string[]) => {
    setSelectedMaterials(newSelectedMaterials.map(id => ({ id, quantity: 0 })));
    newSelectedMaterials.forEach(id => {
      if (!inputValues[id]) {
        setInputValues(oldValues => ({ ...oldValues, [id]: '0' }));
      }
    });
  };

  const onInputChange = (id: string, text: string) => {
    setInputValues(oldValues => ({ ...oldValues, [id]: text }));
  };

  const onBlur = (id: string, isMaterial: boolean) => {
    const quantity = Number(inputValues[id]) || 0;
    if (isMaterial) {
      setSelectedMaterials(oldMaterials =>
        oldMaterials.map(m =>
          m.id === id ? { ...m, quantity } : m
        )
      );
    } else {
      setSelectedTools(oldTools =>
        oldTools.map(t =>
          t.id === id ? { ...t, quantity } : t
        )
      );
    }
  };

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const db = getFirestore();
        const querySnapshot = await getDocs(collection(db, 'tools'));
        setTools(querySnapshot.docs.map((doc) => ({ id: doc.id, name: doc.data().name })));
      } catch (error) {
        console.error('Error fetching tools: ', error);
      }
    };

    const fetchMaterials = async () => {
      try {
        const db = getFirestore();
        const querySnapshot = await getDocs(collection(db, 'materials'));
        setMaterials(querySnapshot.docs.map((doc) => ({ id: doc.id, name: doc.data().name })));
      } catch (error) {
        console.error('Error fetching materials: ', error);
      }
    };

    fetchTools();
    fetchMaterials();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Valittu asiakas: {customer.name}</Text>
      <Text style={styles.headerText}>Valittu työmaa: {worksite.name}</Text>

      <Text style={styles.subHeaderText}>Valitse työkalut/laitteet</Text>
      <View style={styles.multiSelectContainer}>
        <MultiSelect
          items={tools}
          selectText="Valitse"
          selectedText="Valittu"
          uniqueKey="id"
          onSelectedItemsChange={onSelectedToolsChange}
          selectedItems={selectedTools.map(t => t.id)}
        />
      </View>

      <Text style={styles.subHeaderText}>Valitse materiaalit</Text>
      <View style={styles.multiSelectContainer}>
        <MultiSelect
          items={materials}
          selectText="Valitse"
          selectedText="Valittu"
          uniqueKey="id"
          onSelectedItemsChange={onSelectedMaterialsChange}
          selectedItems={selectedMaterials.map(m => m.id)}
        />
      </View>

      <TouchableOpacity style={styles.buttonContainer} onPress={onProceed}>
        <Text style={styles.buttonText}>Siirry valitsemaan lukumäärät</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 20,
    backgroundColor: '#40E0D0',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    marginTop: 0,
  },
  multiSelectContainer: {
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#888',
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
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  input: {
    width: '30%',
    height: 40,
    borderColor: '#888',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
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
    marginVertical: 30,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  subHeaderText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'left',
    marginVertical: 10,
  },
});


export default MaterialEntry;
