/* eslint-disable prettier/prettier */


// src/components/LoginForm.tsx

import React, { useState } from 'react';
import { Image, TextInput, View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { loginUser } from '../services/firebase';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type LoginFormNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Login'
>;

type Props = {
  navigation: LoginFormNavigationProp;
};

const LoginForm: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    try {
      const userCredential = await loginUser(email, password);
      if (userCredential) {

        navigation.navigate('WorksiteSelection');

      } else {
        setErrorMessage('Kirjautuminen epäonnistui.');
      }
    } catch (error) {
      setErrorMessage((error as any).message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Image
          style={styles.logo}
          source={require('../images/logo.png')}
          resizeMode="contain"
        />
      </View>
      {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Sähköposti"
          onChangeText={text => setEmail(text)}
          value={email}
        />
        <TextInput
          style={styles.input}
          placeholder="Salasana"
          secureTextEntry
          onChangeText={text => setPassword(text)}
          value={password}
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Kirjaudu</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#40E0D0',
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  logo: {
    width: 400,
    height: 400,
    marginBottom: 20,
  },
  formContainer: {
    flex: 2,
    justifyContent: 'center',
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 5,
    backgroundColor: 'white',
  },
  button: {
    height: 50,
    backgroundColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
  },
  error: {
    color: 'red',
  },
});

export default LoginForm;
