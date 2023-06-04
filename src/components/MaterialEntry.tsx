/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */

/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
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
    <View>
      <MultiSelect
        items={tools}
        uniqueKey="id"
        onSelectedItemsChange={onSelectedToolsChange}
        selectedItems={selectedTools.map(t => t.id)}
      />
      {selectedTools.map(tool => (
        <View key={tool.id}>
          <Text>{tools.find(t => t.id === tool.id)?.name}</Text>
          <TextInput
            keyboardType="numeric"
            value={inputValues[tool.id]}
            onChangeText={(text) => onInputChange(tool.id, text)}
            onBlur={() => onBlur(tool.id, false)}
          />
        </View>
      ))}
      <MultiSelect
        items={materials}
        uniqueKey="id"
        onSelectedItemsChange={onSelectedMaterialsChange}
        selectedItems={selectedMaterials.map(m => m.id)}
      />
      {selectedMaterials.map(material => (
        <View key={material.id}>
          <Text>{materials.find(m => m.id === material.id)?.name}</Text>
          <TextInput
            keyboardType="numeric"
            value={inputValues[material.id]}
            onChangeText={(text) => onInputChange(material.id, text)}
            onBlur={() => onBlur(material.id, true)}
          />
        </View>
      ))}
      <TouchableOpacity onPress={onProceed}>
        <Text>Siirry valitsemaan lukumäärät</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MaterialEntry;
