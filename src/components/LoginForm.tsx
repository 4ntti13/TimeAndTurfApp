/* eslint-disable prettier/prettier */


// src/components/LoginForm.tsx

import React, { useContext, useState } from 'react'; // import useContext
import { Image, TextInput, View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { loginUser } from '../services/firebase';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { AuthContext } from '../contexts/AuthContext'; // import AuthContext

type LoginFormNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Login'
>;

type Props = {
  navigation: LoginFormNavigationProp;
};

const LoginForm: React.FC<Props> = ({ navigation }) => {
  const { setUser } = useContext(AuthContext); // get setUser function from AuthContext
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    try {
      const userCredential = await loginUser(email, password);
      if (userCredential) {
        setUser({ email }); // set user email in AuthContext
        navigation.navigate('WorksiteSelection');
      } else {
        setErrorMessage('Kirjautuminen epäonnistui, tunnus tai salasana väärin!');
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
    padding: 20,
    backgroundColor: '#40E0D0',
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 300,
    height: 300,
    marginBottom: 30,
  },
  formContainer: {
    flex: 2,
    justifyContent: 'center',
  },
  input: {
    height: 50,
    borderColor: '#888',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    borderRadius: 10,
    backgroundColor: 'white',
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
  button: {
    height: 50,
    backgroundColor: '#444',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default LoginForm;
