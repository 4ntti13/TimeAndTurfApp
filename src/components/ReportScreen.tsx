/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
// ReportScreen:

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { RootStackParamList } from '../navigation/AppNavigator';
import { RouteProp } from '@react-navigation/native';

type ReportScreenRouteProp = RouteProp<RootStackParamList, 'ReportScreen'>;
type Props = {
  route: ReportScreenRouteProp;
}

const ReportScreen: React.FC<Props> = ( {route} ) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  // Muotoilu päivämäärälle
  const formatDate = (date: Date) => {
    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
  };



  const { selectedUsers = []} = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.headerText}>Valitse aikaväli</Text>
      </View>

      <Text style={styles.dateText}>Aloituspäivä: {formatDate(startDate)}</Text>
      <TouchableOpacity style={styles.buttonContainer} onPress={() => setShowStartDatePicker(true)}>
        <Text style={styles.buttonText}>Valitse aloituspäivä</Text>
      </TouchableOpacity>
      {showStartDatePicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          onChange={(event, date) => {
            if (date) {
              setStartDate(date);
            }
            setShowStartDatePicker(false);
          }}
        />
      )}

      <Text style={styles.dateText}>Lopetuspäivä: {formatDate(endDate)}</Text>
      <TouchableOpacity style={styles.buttonContainer} onPress={() => setShowEndDatePicker(true)}>
        <Text style={styles.buttonText}>Valitse lopetuspäivä</Text>
      </TouchableOpacity>
      {showEndDatePicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          onChange={(event, date) => {
            if (date) {
              setEndDate(date);
            }
            setShowEndDatePicker(false);
          }}
        />
      )}
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
  dateText: {
    fontSize: 18,
    marginBottom: 10,
    marginLeft: 10,
    color: '#444',
  },
});

export default ReportScreen;
