/* eslint-disable prettier/prettier */
// AddUser.tsx:

import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth'; // Päivitetty import
import firestore from '@react-native-firebase/firestore'; // Päivitetty import

const AddUser: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(''); // esim. admin tai user

  const handleAddUser = async (userEmail: string, userPassword: string, userRole: string) => {
    try {
      // Rekisteröi käyttäjä Firebase Authentication -palveluun
      const userCredential = await auth().createUserWithEmailAndPassword(userEmail, userPassword);
      const { user } = userCredential;

      if (user) {
        // Tallenna lisätiedot Firestore-tietokantaan
        await firestore().collection('users').add({
          uid: user.uid,
          email: userEmail,
          role: userRole,
        });
        console.log('Käyttäjä lisätty onnistuneesti!');
      }
    } catch (error) {
      console.error('Virhe lisätessä käyttäjää:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput placeholder="Salasana" value={password} onChangeText={setPassword} secureTextEntry />
      <TextInput placeholder="Rooli (esim. admin tai user)" value={role} onChangeText={setRole} />
      <Button title="Lisää Käyttäjä" onPress={() => handleAddUser(email, password, role)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 15,
    backgroundColor: '#40E0D0',
  },
  // Add other styles as required
});

export default AddUser;
