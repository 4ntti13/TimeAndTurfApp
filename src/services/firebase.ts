/* eslint-disable prettier/prettier */


// Import the functions you need from the SDKs
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
    apiKey: 'AIzaSyDQsE9hCb1eygsB6xJsP0q5j8UdkRKi7zQ',
    authDomain: 'timeandturfapp.firebaseapp.com',
    projectId: 'timeandturfapp',
    storageBucket: 'timeandturfapp.appspot.com',
    messagingSenderId: '1091743621537',
    appId: '1:1091743621537:web:a16994886b609a1b2f6be0',
    measurementId: 'G-3CFV8BVTM4',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const loginUser = async (email: string, password: string) => {
    const auth = getAuth();
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential;
    } catch (error) {
        console.error(error);
        return null;
    }
};

