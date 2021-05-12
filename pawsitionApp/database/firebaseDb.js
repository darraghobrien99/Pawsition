// database/firebaseDb.js

import * as firebase from 'firebase';
import firestore from 'firebase/firestore'


const firebaseConfig = {
    apiKey: "AIzaSyAX71H1Nm0AhdDtod5EJ2YLsbFbvHrUxOE",
    authDomain: "dog-tracker-b4357.firebaseapp.com",
    databaseURL: "https://dog-tracker-b4357-default-rtdb.europe-west1.firebasedatabase.app/",
    projectId: "dog-tracker-b4357",
    storageBucket: "dog-tracker-b4357.appspot.com",
    messagingSenderId: "1084261614705",
    appId: "1:1084261614705:android:e44f8701bf0380c4a947d0"
};

firebase.initializeApp(firebaseConfig);

firebase.firestore();

export default firebase;