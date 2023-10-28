/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type WorksiteDetailsRouteProp = RouteProp<RootStackParamList, 'WorksiteDetails'>;

type Props = {
  route: WorksiteDetailsRouteProp;
};

const WorksiteDetails: React.FC<Props> = ({ route }) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'WorksiteDetails'>>();
  const { customer, worksite } = route.params;
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [arrivalTime, setArrivalTime] = useState(new Date());
  const [departureTime, setDepartureTime] = useState(new Date());
  const [showDateSelector, setShowDateSelector] = useState(false);
  const [showArrivalDatePicker, setShowArrivalDatePicker] = useState(false);
  const [showDepartureDatePicker, setShowDepartureDatePicker] = useState(false);

  const onDateChange = (event: DateTimePickerEvent, newSelectedDate?: Date) => {
    const currentDate = newSelectedDate || selectedDate;
    setShowDateSelector(false);
    setSelectedDate(currentDate);
    setArrivalTime(currentDate);
    setDepartureTime(currentDate);
  };

  const onArrivalTimeChange = (event: DateTimePickerEvent, selectedTime?: Date) => {
    const currentTime = selectedTime || arrivalTime;
    setShowArrivalDatePicker(false);
    setArrivalTime(currentTime);
  };

  const onDepartureTimeChange = (event: DateTimePickerEvent, selectedTime?: Date) => {
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
      selectedDate: selectedDate.toISOString(),
      selectedTools: [],
      selectedMaterials: [],
      selectedCategories: [],
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.headerTextSmall}>Valittu asiakas: {customer.name}</Text>
        <Text style={styles.headerTextSmall}>Valittu työmaa: {worksite.name}</Text>
      </View>

      <View style={styles.pickerContainer}>
        <Text style={styles.headerText}>Valitse päivämäärä:</Text>
        <Text style={styles.timeText}>{selectedDate.toISOString().slice(0,10)}</Text>
        <TouchableOpacity style={styles.buttonContainer} onPress={() => setShowDateSelector(true)}>
          <Text style={styles.buttonText}>Valitse päivä</Text>
        </TouchableOpacity>
        {showDateSelector && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}
      </View>

      <View style={styles.pickerContainer}>
        <Text style={styles.headerText}>Saapumisaika:</Text>
        <Text style={styles.timeText}>{arrivalTime.toTimeString().slice(0,5)}</Text>
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
        <Text style={styles.timeText}>{departureTime.toTimeString().slice(0,5)}</Text>
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#40E0D0',
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
  headerText: {
    fontSize: 16,
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
