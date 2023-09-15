/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { addDoc, collection, getFirestore } from 'firebase/firestore';



const AddUser: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(''); // esim. admin tai user

  const handleAddUser = async (userEmail: string, userPassword: string, userRole: string) => {
    const auth = getAuth();
    try {
      // Rekisteröi käyttäjä Firebase Authentication -palveluun
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { user } = userCredential;

      if (user) {
        // Tallenna lisätiedot Firestore-tietokantaan
        const db = getFirestore();
        await addDoc(collection(db, 'users'), {
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
