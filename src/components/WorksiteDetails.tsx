/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type WorksiteDetailsRouteProp = RouteProp<RootStackParamList, 'WorksiteDetails'>;

type Props = {
  route: WorksiteDetailsRouteProp;
};

const WorksiteDetails: React.FC<Props> = ({ route }) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'WorksiteDetails'>>();
  const { customer, worksite } = route.params;
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

  const goToMaterialEntry = () => {
    navigation.navigate('MaterialEntry', {
      customer,
      worksite,
      arrivalTime: arrivalTime.toISOString(),
      departureTime: departureTime.toISOString(),
      selectedTools: [], // add this line
      selectedMaterials: [], // add this line
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.headerText}>Valittu asiakas: {customer.name}</Text>
        <Text style={styles.headerText}>Valittu työmaa: {worksite.name}</Text>
      </View>

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

      <TouchableOpacity style={styles.buttonContainer} onPress={goToMaterialEntry}>
          <Text style={styles.buttonText}>Tallenna ja jatka</Text>
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
  timeText: {
    fontSize: 16,
    textAlign: 'center',
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


export default WorksiteDetails;
