import * as React from "react";
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import RegisterDogScreen from '../screens/RegisterDogScreen';
import UserScreen from '../screens/UserScreen';
import DogDetailScreen from '../screens/DogDetailScreen';
import RegisterGeofenceScreen from '../screens/RegisterGeofence';

const Tab = createBottomTabNavigator();
const tabs = () => {
    return(
        <Tab.Navigator>
            <Tab.Screen name="Home" component={UserScreen} />
            <Tab.Screen name="Register Dog" component={RegisterDogScreen}  />
            <Tab.Screen name="Register Geofence" component={RegisterGeofenceScreen} />
        </Tab.Navigator>
    );
}

export default tabs;