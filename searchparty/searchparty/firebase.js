import * as firebase from 'firebase';

// Initialize Firebase
var firebaseConfig = {
    apiKey: "AIzaSyD8nQmIVXENZMOQci_nLs8SxgV3Lu8Ou9g",
    authDomain: "searchparty-54b23.firebaseapp.com",
    databaseURL: "https://searchparty-54b23.firebaseio.com",
    projectId: "searchparty-54b23",
    storageBucket: "searchparty-54b23.appspot.com",
    messagingSenderId: "858151759577",
    appId: "1:858151759577:web:d0c5e1af0b77ba6c9d58c8",
    measurementId: "G-N9DJBEVYZ8"
  };

  const firebaseApp = firebase.initializeApp(firebaseConfig);
  export default firebaseApp;