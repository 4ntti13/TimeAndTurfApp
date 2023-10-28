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

        // Convert uids to email
        const emailPromises = selectedUsers.map(uid =>
          firestore().collection('users').doc(uid).get().then(doc => doc.data()?.email)
        );
        const emails = await Promise.all(emailPromises);

        const startString = startDate.toISOString().split('T')[0];
        const endString = endDate.toISOString().split('T')[0];

        for (const email of emails) {

          console.log('start date:', startDate);
          console.log('end date:', endDate);
          console.log('Fetching data for email:', email);
          console.log('Start:', startString, 'End:',endString);

          // Query to fetch data based on email, startDate, and endDate
          const snapshot = await firestore()
            .collection('summaries')
            .where('user', '==', email)
            .where('selectedDate', '>=', startString)
            .where('selectedDate', '<=', endString)
            .get();

          console.log(`Data for email ${email}:`, snapshot.docs.map(doc => doc.data()));

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

  const formatDate = (date: Date) => {
    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
  };

  const formatTime = (time: string) => {
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
    };
    const parsedTime = new Date(time);
    return parsedTime.toLocaleTimeString('fi-FI', options);
  };

  const createAndSharePDF = async () => {

    type Material = {
      name: string;
      quantity: string;
    };

    type Tool = {
      name: string;
      quantity: string;
    };
  // Construct HTML from summaries
  const summariesHtml = summaries.map(summary => {
    const summaryDate = summary.selectedDate?.toDate ? summary.selectedDate.toDate() : new Date(summary.selectedDate);

    const materialsHtml = summary.selectedMaterials.map((material: Material) =>
      `<li>${material.name}: ${material.quantity} kpl</li>`
    ).join('');

    const toolsHtml = summary.selectedTools.map((tool: Tool) =>
      `<li>${tool.name}: ${tool.quantity} kpl</li>`
    ).join('');

    return `
      <div class="summary">
        <h2>${summary.worksite}</h2>
        <h3>Työntekijä: ${summary.user}</h3>
        <h3>Asiakas: ${summary.customer}</h3>
        <p>Päivämäärä: ${formatDate(summaryDate)}</p>
        <p>Saapumisaika: ${formatTime(summary.arrivalTime)}</p>
        <p>Lähtöaika: ${formatTime(summary.departureTime)}</p>
        <div>
          <p>Materiaalit:</p>
          <ul>${materialsHtml}</ul>
        </div>
        <div>
          <p>Työkalut/laitteet:</p>
          <ul>${toolsHtml}</ul>
        </div>
        <p>Kommentit: ${summary.comments}</p>
      </div>
      <hr>
    `;
  }).join('');

  // HTML and options for the PDF creation
  let options = {
    html: `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            h1 {
              font-size: 24px;
              text-align: left;
            }
            h2 {
              font-size: 20px;
              margin-top: 20px;
            }
            h3 {
              font-size: 18px;
              margin-top: 15px;
            }
            p, ul, div {
              margin-top: 10px;
              font-size: 16px;
            }
            li {
              margin-bottom: 5px;
            }
            hr {
              border-top: 2px solid #444;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <h1>Raportti</h1>
          <p>Aloituspäivä: ${formatDate(startDate)}</p>
          <p>Lopetuspäivä: ${formatDate(endDate)}</p>
          ${summariesHtml}
        </body>
      </html>
    `,
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
