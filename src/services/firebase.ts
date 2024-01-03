/* eslint-disable prettier/prettier */
// Import the functions you need from the SDKs
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';

const firebaseConfig = {
// apikey and stuff
  };

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export const loginUser = async (email: string, password: string) => {
    try {
        const userCredential = await auth().signInWithEmailAndPassword(email, password);
        return userCredential;
    } catch (error) {
        console.error(error);
        return null;
    }
};

