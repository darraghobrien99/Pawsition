// App.js
import { NavigationContainer, StackActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import RegisterDogScreen from './screens/RegisterDogScreen';
import UserScreen from './screens/UserScreen';
import DogDetailScreen from './screens/DogDetailScreen';
import RegisterGeofenceScreen from './screens/RegisterGeofence';
import GeofenceScreen from './screens/Geofence';
import Toast from 'react-native-toast-message';
import Tabs from './navigation/tabs';

const App = () => {
  return(
 
    <NavigationContainer>
      <Tabs />
    </NavigationContainer>
  )
}

export default App;

