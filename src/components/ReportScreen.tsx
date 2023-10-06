/* eslint-disable prettier/prettier */

/* eslint-disable prettier/prettier */

/* eslint-disable prettier/prettier */
// ReportScreen:

import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { RootStackParamList } from '../navigation/AppNavigator';
import { RouteProp } from '@react-navigation/native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share';
import firestore from '@react-native-firebase/firestore';

type ReportScreenRouteProp = RouteProp<RootStackParamList, 'ReportScreen'>;
type Props = {
  route: ReportScreenRouteProp;
}



const ReportScreen: React.FC<Props> = ( {route} ) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [summaries, setSummaries] = useState<any[]>([]);
  const { selectedUsers = [] } = route.params;
  console.log('Received users in ReportScreen:', selectedUsers);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let fetchedSummaries: any[] = [];

        for (const user of selectedUsers) {
          // Convert dates to Firestore timestamps
          const startTimestamp = firestore.Timestamp.fromDate(new Date(startDate));
          const endTimestamp = firestore.Timestamp.fromDate(new Date(endDate));
          console.log('Fetching data for user:', user);
          console.log('Start:', startTimestamp, 'End:', endTimestamp);

          // Query to fetch data based on user, startDate, and endDate
          const snapshot = await firestore()
            .collection('summaries')
            .where('user', '==', user)
            // .where('selectedDate', '>=', startTimestamp)
            // .where('selectedDate', '<=', endTimestamp)
            .get();

          console.log(`Data for user ${user}:`, snapshot.docs.map(doc => doc.data()));

          fetchedSummaries = [...fetchedSummaries, ...snapshot.docs.map(doc => doc.data())];
        }

        setSummaries(fetchedSummaries);
        console.log('Fetched summaries: ',fetchedSummaries);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, [startDate, endDate, selectedUsers]);

  // Muotoilu päivämäärälle
  const formatDate = (date: Date) => {
    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
  };

  const createAndSharePDF = async () => {
    // Construct HTML from summaries
    const summariesHtml = summaries.map(summary => {
      // Muutetaan Timestamp-objekti Date-objektiksi
      const summaryDate = summary.selectedDate?.toDate ? summary.selectedDate.toDate() : new Date(summary.selectedDate);
      return `
        <h2>${summary.worksite}</h2>
        <p>Date: ${summaryDate.toLocaleDateString()}</p>
        <p>Arrival Time: ${summary.arrivalTime}</p>
        <p>Departure Time: ${summary.departureTime}</p>
        <p>Comments: ${summary.comments}</p>
      `;
    }).join('');

    // HTML and options for the PDF creation
    let options = {
      html: `<h1>Raportti</h1><p>Aloituspäivä: ${formatDate(startDate)}</p><p>Lopetuspäivä: ${formatDate(endDate)}</p>${summariesHtml}`,
      fileName: 'report',
      directory: 'docs',
    };

    try {
      const { filePath } = await RNHTMLtoPDF.convert(options);
      await Share.open({
        url: `file://${filePath}`,
        type: 'application/pdf',
      });
    } catch (error) {
      console.error(error);
    }
  };



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

      <TouchableOpacity style={styles.buttonContainer} onPress={createAndSharePDF}>
        <Text style={styles.buttonText}>Luo ja jaa raportti</Text>
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
