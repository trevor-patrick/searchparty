import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
// import firebaseApp from './firebase.js';
import LoginScreen from './screens/LoginScreen';
import MapScreen from './screens/MapScreen';
import Navigator from './routes/homeStack';

// // Your web app's Firebase configuration
// var firebaseConfig = {
//   apiKey: "AIzaSyD8nQmIVXENZMOQci_nLs8SxgV3Lu8Ou9g",
//   authDomain: "searchparty-54b23.firebaseapp.com",
//   databaseURL: "https://searchparty-54b23.firebaseio.com",
//   projectId: "searchparty-54b23",
//   storageBucket: "searchparty-54b23.appspot.com",
//   messagingSenderId: "858151759577",
//   appId: "1:858151759577:web:d0c5e1af0b77ba6c9d58c8",
//   measurementId: "G-N9DJBEVYZ8"
// };
// Initialize Firebase
// if (!firebase.apps.length) {
//   firebase.initializeApp(firebaseConfig);
// }
// firebase.analytics();
// Get a reference to the database service
// var database = firebaseApp.database();

export default class App extends React.Component {
  
  render() {
    return (
      <Navigator screenOptions={{headerShown: false}}></Navigator>
      // <LoginScreen></LoginScreen>
      // <MapScreen></MapScreen>
    );

  }
}