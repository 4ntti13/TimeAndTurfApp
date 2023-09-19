/* eslint-disable prettier/prettier */
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

const ToolEntry: React.FC<Props> = ({ route, navigation }) => {
  const { customer, worksite, arrivalTime, departureTime, selectedMaterials } = route.params;
  const [tools, setTools] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [selectedTools, setSelectedTools] = useState<{ id: string, quantity: number }[]>([]);

  const onProceed = () => {
    const selectedToolNames = selectedTools.map(tool => tools.find(t => t.id === tool.id)?.name || '');
    const selectedMaterialNames = selectedMaterials.map(material => materials.find(m => m.id === material.id)?.name || '');

    navigation.navigate('QuantityEntry', {
      customer,
      worksite,
      arrivalTime,
      departureTime,
      selectedTools,
      selectedMaterials,
      selectedToolNames,
      selectedMaterialNames,
    });
  };

  const onSelectedToolsChange = (newSelectedTools: string[]) => {
    setSelectedTools(newSelectedTools.map(id => ({ id, quantity: 0 })));
  };

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const querySnapshot = await firestore().collection('tools').get();  // <-- Updated
        setTools(querySnapshot.docs.map((doc) => ({ id: doc.id, name: doc.data().name })));
      } catch (error) {
        console.error('Error fetching tools: ', error);
      }
    };

    const fetchMaterials = async () => {
      try {
        const querySnapshot = await firestore().collection('materials').get();  // <-- Updated
        setMaterials(querySnapshot.docs.map((doc) => ({ id: doc.id, name: doc.data().name })));
      } catch (error) {
        console.error('Error fetching materials: ', error);
      }
    };

    fetchTools();
    fetchMaterials();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={tools}
        keyExtractor={item => item.id}
        renderItem={() => null} // Lisätty tyhjä renderItem-funktio
        ListHeaderComponent={
          <View>
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
