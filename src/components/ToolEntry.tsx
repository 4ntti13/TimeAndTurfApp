/* eslint-disable prettier/prettier */
// ToolEntry:
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';
import MultiSelect from 'react-native-multiple-select';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import firestore from '@react-native-firebase/firestore';  // <-- Updated

type ToolEntryRouteProp = RouteProp<RootStackParamList, 'ToolEntry'>;
type ToolEntryNavigationProp = NavigationProp<RootStackParamList, 'ToolEntry'>;

type Props = {
  route: ToolEntryRouteProp;
  navigation: ToolEntryNavigationProp;
};

const translations: { [key: string]: string } = {
  soils: 'Maa-ainekset',
  pipeFittings: 'Putkitarvikkeet',
  machines: 'Koneet',
  trucks: 'Kuorma-autot',
  compactors: 'Tiivistäjät',
};

const ToolEntry: React.FC<Props> = ({ route, navigation }) => {
  const { customer, worksite, arrivalTime, departureTime, selectedMaterials, selectedDate } = route.params;
  console.log('ToolEntry params:', route.params);
  const [tools, setTools] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [selectedTools, setSelectedTools] = useState<{ id: string, quantity: number }[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [filteredTools, setFilteredTools] = useState<any[]>([]);

  const onProceed = () => {
    console.log('Proceeding with selected tools:', selectedTools);
    const selectedToolNames = selectedTools.map(tool => tools.find(t => t.id === tool.id)?.name || '');
    const selectedMaterialNames = selectedMaterials.map(material => materials.find(m => m.id === material.id)?.name || '');
    console.log('selected material names: ', selectedMaterialNames);
    navigation.navigate('QuantityEntry', {
      customer,
      worksite,
      selectedDate,
      arrivalTime,
      departureTime,
      selectedTools,
      selectedMaterials,
      selectedToolNames,
      selectedMaterialNames,

    });
  };

  const onSelectedCategoriesChange = (newSelectedCategories: string[]) => {
    console.log('New selected categories (Tools):', newSelectedCategories);
    setSelectedCategories(newSelectedCategories);
  };

  useEffect(() => {
    console.log('Selected categories state (Tools):', selectedCategories);
}, [selectedCategories]);

  useEffect(() => {
    if (selectedCategories.length > 0) {
      const filtered = tools.filter(t => selectedCategories.includes(t.category));
      console.log('Filtered tools:', filtered);
      setFilteredTools(filtered);
    } else {
      setFilteredTools([]);
    }
  }, [selectedCategories, tools]);

  const onSelectedToolsChange = (newSelectedTools: string[]) => {
    setSelectedTools(prevState => {
      const alreadySelected = prevState.filter(tool => newSelectedTools.includes(tool.id));
      const newItems = newSelectedTools.filter(
        id => !prevState.some(tool => tool.id === id)
      ).map(id => ({ id, quantity: 0 }));
      return [...alreadySelected, ...newItems];
    });
  };

  useEffect(() => {
    setSelectedCategories(route.params.selectedCategories);
// eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

useEffect(() => {
  const fetchToolsAndCategories = async () => {
      try {
          const toolSnapshot = await firestore().collection('tools').get();

          const fetchedTools = toolSnapshot.docs.map((doc) => ({
              id: doc.id,
              name: doc.data().name,
              category: doc.data().category,
          })).filter(tool => ['machines', 'trucks', 'compactors'].includes(tool.category));
          setTools(fetchedTools);

          const uniqueCategories = [...new Set(fetchedTools.map(t => t.category))];
          setCategories(uniqueCategories.map(category => ({
              id: category,
              name: translations[category] || category,
          })));
      } catch (error) {
          console.error('Data cannot be fetched: ', error);
      }
  };

  fetchToolsAndCategories();
}, []);

useEffect(() => {
  const fetchTools = async () => {
    try {
      const toolSnapshot = await firestore().collection('tools').get();
      const fetchedTools = toolSnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        category: doc.data().category,
      }));
      setTools(fetchedTools);
      setFilteredTools(fetchedTools);
    } catch (error) {
      console.error('Data cannot be fetched: ', error);
    }
  };

  fetchTools();
}, []);


useEffect(() => {
  const fetchMaterials = async () => {
    try {
      const materialSnapshot = await firestore().collection('materials').get();
      const fetchedMaterials = materialSnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        category: doc.data().category,
      }));
      setMaterials(fetchedMaterials);
    } catch (error) {
      console.error('Materials cannot be fetched: ', error);
    }
  };

  fetchMaterials();
}, []);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={filteredTools}
        keyExtractor={item => item.id}
        renderItem={() => null} // Lisätty tyhjä renderItem-funktio
        ListHeaderComponent={
          <View>
            <Text style={styles.subHeaderText}>Valitse kategoriat</Text>
              <View style={styles.multiSelectContainer}>
                <MultiSelect
                  items={categories}
                  selectText="Valitse"
                  selectedText="Valittu"
                  uniqueKey="id"
                  onSelectedItemsChange={onSelectedCategoriesChange}
                  selectedItems={selectedCategories}
                />
              </View>
              <Text style={styles.subHeaderText}>Valitse työkalut/laitteet</Text>
              <View style={styles.multiSelectContainer}>
                <MultiSelect
                  items={filteredTools}
                  selectText="Valitse"
                  selectedText="Valittu"
                  uniqueKey="id"
                  onSelectedItemsChange={onSelectedToolsChange}
                  selectedItems={selectedTools.map(t => t.id)}
                />
              </View>
          </View>
        }
        ListFooterComponent={
          <TouchableOpacity style={styles.buttonContainer} onPress={onProceed}>
            <Text style={styles.buttonText}>Siirry valitsemaan määrät</Text>
          </TouchableOpacity>
        }
      />
    </SafeAreaView>
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


  export default ToolEntry;
