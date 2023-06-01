/* eslint-disable prettier/prettier */

/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import DateTimePicker from '@react-native-community/datetimepicker';

type WorksiteDetailsRouteProp = RouteProp<RootStackParamList, 'WorksiteDetails'>;

type Props = {
  route: WorksiteDetailsRouteProp;
};

const WorksiteDetails: React.FC<Props> = ({ route }) => {
  const { customer, worksite } = route.params;

  const [selectedTool, setSelectedTool] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [tools, setTools] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [arrivalTime, setArrivalTime] = useState(new Date());
  const [departureTime, setDepartureTime] = useState(new Date());
  const [showArrivalDatePicker, setShowArrivalDatePicker] = useState(false);
  const [showDepartureDatePicker, setShowDepartureDatePicker] = useState(false);

  const onArrivalTimeChange = (event: Event, selectedTime?: Date) => {
    const currentTime = selectedTime || arrivalTime;
    setShowArrivalDatePicker(false);
    setArrivalTime(currentTime);
  };

  const onDepartureTimeChange = (event: Event, selectedTime?: Date) => {
    const currentTime = selectedTime || departureTime;
    setShowDepartureDatePicker(false);
    setDepartureTime(currentTime);
  };

  useEffect(() => {
    const fetchTools = async () => {
      const db = getFirestore();
      const querySnapshot = await getDocs(collection(db, 'tools'));
      setTools(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    const fetchMaterials = async () => {
      const db = getFirestore();
      const querySnapshot = await getDocs(collection(db, 'materials'));
      setMaterials(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    fetchTools();
    fetchMaterials();
  }, []);

  const handleToolChange = (tool: any) => {
    setSelectedTool(tool);
  };

  const handleMaterialChange = (material: any) => {
    setSelectedMaterial(material);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Valittu asiakas: {customer.name}</Text>
      <Text style={styles.headerText}>Valittu työmaa: {worksite.name}</Text>

      <View style={styles.pickerContainer}>
        <Text style={styles.headerText}>Saapumisaika:</Text>
        <Text style={styles.timeText}>{arrivalTime.toISOString().slice(0,10)} {arrivalTime.toTimeString().slice(0,5)}</Text>
        <TouchableOpacity style={styles.buttonContainer} onPress={() => setShowArrivalDatePicker(true)}>
          <Text style={styles.buttonText}>Valitse saapumisaika</Text>
        </TouchableOpacity>
        {showArrivalDatePicker && (
          <DateTimePicker
            value={arrivalTime}
            mode="time"
            display="default"
            onChange={onArrivalTimeChange}
          />
        )}
      </View>

      <View style={styles.pickerContainer}>
        <Text style={styles.headerText}>Lähtöaika:</Text>
        <Text style={styles.timeText}>{departureTime.toISOString().slice(0,10)} {departureTime.toTimeString().slice(0,5)}</Text>
        <TouchableOpacity style={styles.buttonContainer} onPress={() => setShowDepartureDatePicker(true)}>
          <Text style={styles.buttonText}>Valitse lähtöaika</Text>
        </TouchableOpacity>
        {showDepartureDatePicker && (
          <DateTimePicker
            value={departureTime}
            mode="time"
            display="default"
            onChange={onDepartureTimeChange}
          />
        )}
      </View>

      <View style={styles.pickerContainer}>
        <Text style={styles.headerText}>Valitse työkalu:</Text>
        <Picker
          selectedValue={selectedTool}
          onValueChange={handleToolChange}>
          {tools.map((tool, index) => (
            <Picker.Item key={index} label={tool.name} value={tool.id} />
          ))}
        </Picker>
      </View>

      <View style={styles.pickerContainer}>
        <Text style={styles.headerText}>Valitse materiaali:</Text>
        <Picker
          selectedValue={selectedMaterial}
          onValueChange={handleMaterialChange}>
          {materials.map((material, index) => (
            <Picker.Item key={index} label={material.name} value={material.id} />
          ))}
        </Picker>
      </View>
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
  headerText: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 10,
  },
  timeText: {
    fontSize: 16,
    textAlign: 'center',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: 'gray',
    backgroundColor: 'white',
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonContainer: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'gray',
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
  },
});

export default WorksiteDetails;
