/* eslint-disable prettier/prettier */

/* eslint-disable prettier/prettier */
// AdminPage.tsx:
import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigation/AppNavigator';
import auth from '@react-native-firebase/auth';

type AdminPageNavigationProp = StackNavigationProp<
  RootStackParamList,
  'AdminPage'
>;

type Props = {
  navigation: AdminPageNavigationProp;
};


const AdminPage: React.FC<Props> = ({navigation}) => {


  const handleSignOut = async () => {
    try {
      await auth().signOut();
      navigation.navigate('Login');
    } catch (error) {
      console.error('Sign out failed', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hallintapaneeli</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('AddCustomer')}>
        <Text style={styles.buttonText}>Lisää uusi asiakas</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('AddWorksite')}>
        <Text style={styles.buttonText}>Lisää uusi työmaa</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('AddTool')}>
        <Text style={styles.buttonText}>Lisää uusi laite/työkalu</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('AddMaterial')}>
        <Text style={styles.buttonText}>Lisää uusi materiaali</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('WorksiteSelection')}>
        <Text style={styles.buttonText}>Tee työmaasuorite</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('UserSelectionScreen')}>
        <Text style={styles.buttonText}>Hae raportti</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('AddUser')}>
        <Text style={styles.buttonText}>Lisää uusi käyttäjä</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={handleSignOut}>
        <Text style={styles.buttonText}>Kirjaudu ulos</Text>
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
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  button: {
    height: 50,
    width: 250,
    backgroundColor: '#444',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AdminPage;
