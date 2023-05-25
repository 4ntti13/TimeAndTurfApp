/* eslint-disable prettier/prettier */

/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import { Button, TextInput, View, StyleSheet } from 'react-native';
import { registerUser } from '../services/firebase';

import '@firebase/auth';
const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    const userCredential = await registerUser(email, password);
    if (userCredential) {
      // Registration succeeded
      console.log('Registration successful');
    } else {
      // Registration failed, show error message
      console.log('Registration failed');
    }
  };


  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Sähköpostiosoite"
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
      <Button color="#40E0D0" onPress={handleRegister} title="Luo uusi käyttäjä" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
  },
});

export default RegisterForm;
