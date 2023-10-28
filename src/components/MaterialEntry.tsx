/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
// MaterialEntry.tsx:
import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, TouchableOpacity, View, FlatList, SafeAreaView } from 'react-native';
import MultiSelect from 'react-native-multiple-select';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import firestore from '@react-native-firebase/firestore';

const translations: { [key: string]: string } = {
  soils: 'Maa-ainekset',
  pipeFittings: 'Putkitarvikkeet',
};

type MaterialEntryRouteProp = RouteProp<RootStackParamList, 'MaterialEntry'>;
type MaterialEntryNavigationProp = NavigationProp<RootStackParamList, 'MaterialEntry'>;
type Props = {
  route: MaterialEntryRouteProp;
  navigation: MaterialEntryNavigationProp;
};

const MaterialEntry: React.FC<Props> = ({ route, navigation }) => {
  const { customer, worksite, arrivalTime, departureTime, selectedDate } = route.params;
  const [materials, setMaterials] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<{ id: string, quantity: number }[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [filteredMaterials, setFilteredMaterials] = useState<any[]>([]);
  console.log('selected materials: ', selectedMaterials);
  const onProceed = () => {
    navigation.navigate('ToolEntry', {
      customer,
      worksite,
      selectedDate,
      arrivalTime,
      departureTime,
      selectedMaterials,
      selectedCategories,
    });
  };
  const onSelectedCategoriesChange = (newSelectedCategories: string[]) => {
    setSelectedCategories(newSelectedCategories);
  };

  const onSelectedMaterialsChange = (newSelectedMaterials: string[]) => {
    setSelectedMaterials(prevState => {
      const alreadySelected = prevState.filter(mat => newSelectedMaterials.includes(mat.id));
      const newItems = newSelectedMaterials.filter(
        id => !prevState.some(mat => mat.id === id)
      ).map(id => ({ id, quantity: 0 }));
      const newState = [...alreadySelected, ...newItems];
      console.log('New state:', newState);
      return newState;
    });
  };

  useEffect(() => {
    if (selectedCategories.length > 0) {
      const filtered = materials.filter(m => selectedCategories.includes(m.category));
      setFilteredMaterials(filtered);
    } else {
      setFilteredMaterials([]);
    }
  }, [selectedCategories, materials]);

  useEffect(() => {
    const fetchMaterialsAndCategories = async () => {
      try {
        const materialSnapshot = await firestore().collection('materials').get();

        const fetchedMaterials = materialSnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          category: doc.data().category,
        }));
        setMaterials(fetchedMaterials);

        const uniqueCategories = [...new Set(fetchedMaterials.map(m => m.category))];
        setCategories(uniqueCategories.map(category => ({
          id: category,
          name: translations[category] || category,
        })));
      } catch (error) {
        console.error('Data cannot be fetched: ', error);
      }
    };

    fetchMaterialsAndCategories();
}, []);

  useEffect(() => {
    console.log('Materials:', materials);
    console.log('Selected categories:', selectedCategories);
}, [materials, selectedCategories]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.headerTextSmall}>Valittu asiakas: {customer.name}</Text>
        <Text style={styles.headerTextSmall}>Valittu työmaa: {worksite.name}</Text>
      </View>
      <Text style={styles.headerText}>Materiaalivalinta</Text>
      <FlatList
        data={filteredMaterials}
        keyExtractor={item => item.id}
        renderItem={() => null}
        ListHeaderComponent={
          <View>
            <Text style={styles.subHeaderText}>Valitse kategoriat</Text>
            <View style={styles.multiSelectContainer}>
              <MultiSelect
                items={categories}
                searchInputPlaceholderText="Etsi"
                submitButtonText="Tallenna"
                selectText="Valitse"
                selectedText="Valittu"
                uniqueKey="id"
                onSelectedItemsChange={onSelectedCategoriesChange}
                selectedItems={selectedCategories}
              />
            </View>
            <Text style={styles.subHeaderText}>Valitse materiaalit</Text>
            <View style={styles.multiSelectContainer}>
              <MultiSelect
                items={filteredMaterials}
                searchInputPlaceholderText="Etsi"
                submitButtonText="Tallenna"
                selectText="Valitse"
                selectedText="Valittu"
                uniqueKey="id"
                onSelectedItemsChange={onSelectedMaterialsChange}
                selectedItems={selectedMaterials.map(m => m.id)}
              />
            </View>
          </View>
        }
        ListFooterComponent={
          <TouchableOpacity style={styles.buttonContainer} onPress={onProceed}>
            <Text style={styles.buttonText}>Siirry valitsemaan laitteet</Text>
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
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 5,
  },
  headerTextSmall: {
    fontSize: 16,
    fontWeight: '400',
    color: '#333',
    textAlign: 'left',
    marginVertical: 8,
  },

  titleContainer: {
    marginBottom: 25,
    paddingLeft: 5,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
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
