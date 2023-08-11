/* eslint-disable prettier/prettier */
import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigation/AppNavigator';

type AdminPageNavigationProp = StackNavigationProp<
  RootStackParamList,
  'AdminPage'
>;

type Props = {
  navigation: AdminPageNavigationProp;
};

const AdminPage: React.FC<Props> = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Paneeli</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('AddCustomer')}>
        <Text style={styles.buttonText}>Lisää Uusi Asiakas</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('AddWorksite')}>
        <Text style={styles.buttonText}>Lisää Uusi Työmaa</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('WorksiteSelection')}>
        <Text style={styles.buttonText}>Siirry työmaavalintaan</Text>
      </TouchableOpacity>


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#40E0D0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    height: 50,
    backgroundColor: '#444',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AdminPage;
