/* eslint-disable prettier/prettier */
// Import the functions you need from the SDKs
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';

const firebaseConfig = {
    apiKey:"",
    authDomain: 'timeandturfapp.firebaseapp.com',
    projectId: 'timeandturfapp',
    storageBucket: 'timeandturfapp.appspot.com',
    messagingSenderId: '1091743621537',
    appId: '1:1091743621537:web:a16994886b609a1b2f6be0',
    measurementId: 'G-3CFV8BVTM4',
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

