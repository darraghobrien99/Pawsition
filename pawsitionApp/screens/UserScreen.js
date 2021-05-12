// screens/UserScreen.js

import React, { Component, useState } from 'react';
import { StyleSheet, TouchableOpacity, Button, View, Text, Platform, Image, ActivityIndicator} from 'react-native';
import firebase from '../database/firebaseDb';
import MapView, { Marker } from "react-native-maps";
import { AppLoading } from 'expo';
import Geofence from './Geofence';
import Pedometer from './Pedometer';
const haversine = require('haversine');
import { ToastNotification } from 'react-native-toast-notification';
import Toast, {DURATION} from 'react-native-easy-toast';
import { padding, style, width } from 'styled-system';
import { Col, Row, Grid } from "react-native-easy-grid";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Header from 'react-native-custom-header';
import { withTheme } from 'styled-components';

const LATITUDE        = 55.16;
const LONGITUDE       = -9.78;
const LATITUDE_DELTA  = 0.0922;
const LONGITUDE_DELTA = 0.0421;


class UserScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
   },

   currentCoords: {
     currentLat: LATITUDE,
     currentLng: LONGITUDE,
   },
        home: 0.0, 
        realtimeLat: 0,
        realtimeLng: 0,
        homeLat: 0,
        homeLng: 0,
        radius: 0,
        withinGeofence: true,
        distanceFromHome: 0,
        loading: true,
        loading2: true,
        distanceTravelled: 0,
        prevLatLng: {},
        name: "",
        age: 0,
        weight: 0,
        breed: ""

    };
    this.readGPSData = this.readGPSData.bind(this);
    this.calculateDistance = this.calculateDistance.bind(this);
    this.calculateDistanceTravelled =  this.calculateDistanceTravelled.bind(this);
    
  }



 async componentDidMount() {
    this.updateTimer = setInterval(() => this.readGPSData(), 20000);
   // this.updateTimer2 = setInterval(() => this.calculateDistance(), 30000);

   const dbRef = firebase.firestore().collection('geofences').doc('Home')
   dbRef.get().then((res) => {
     if (res.exists) {
       const geofence = res.data();
       this.setState({
         homeLat: geofence.lat,
         homeLng: geofence.lng,
         radius: geofence.radius,
         isLoading: false
       });
     } else {
       console.log("Document does not exist!");
     }

     console.log(this.state.homeLat);
     console.log(this.state.homeLng);
   });
  }

  componentWillMount(){
    clearInterval(this.updateTimer);
    clearInterval(this.updateTimer2);
  }


   
  onRegionChange = (region) => {
    this.setState({ region });
 }

 // Get Data from Firebase 
 async readGPSData() {
   let dogLatitude = '';
   let dogLongitude = '';

   const {distanceTravelled} = this.state;

  firebase.database().ref('/location/lat').on('value', function (snapshot) {
     dogLatitude =  snapshot.val();
  });

  firebase.database().ref('/location/lng').on('value', function (snapshot) {
    dogLongitude =  snapshot.val();
  });

  dogLatitude = parseFloat(dogLatitude);
  dogLongitude = parseFloat(dogLongitude);

  const newCoordinates = {
    dogLatitude,
    dogLongitude
  }

  if(!isNaN(dogLatitude) && !isNaN(dogLongitude)){
  await this.setState({region:{
    latitude: dogLatitude,
    longitude: dogLongitude,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA
  },
  //distanceTravelled: distanceTravelled + this.calculateDistanceTravelled(newCoordinates), 
 //prevLatLng: newCoordinates,
  loading: false});

  this.calculateDistance();
 
}

else{
  console.log("im in else");
  this.setState({region:{
    latitude: LATITUDE,
    longitude: LONGITUDE,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA
  }
  });
}
 }

async calculateDistance(){
  const start = {
    latitude: this.state.homeLat,
    longitude: this.state.homeLng
  }

  const end = {
    latitude: this.state.region.latitude,
    longitude: this.state.region.longitude
  }

  var distanceFromHome2 = (haversine(start, end, {unit: 'meter'}))

  distanceFromHome2 = distanceFromHome2.toFixed(2);
 // console.log("const distance" + distanceFromHome2);
  this.setState({distanceFromHome: distanceFromHome2, loading2: false});

  if(distanceFromHome2 > this.state.radius){

    
    this.setState({withinGeofence: false});
    console.log("outside geofence");
    this.toast.show('The Dog is OUTSIDE the defined geofence area', 5000);
  }

  else{
    console.log("Inside geofence");

  }

}

//Calculate Distance Travelled (Does not work)
 calculateDistanceTravelled = newLatLng => {

  console.log("Calculating distance travelled...");
  console.log(newLatLng);
  const { prevLatLng } = this.state;
  console.log("PREVIOUS " + JSON.stringify(prevLatLng));
  const distTrav = haversine(prevLatLng, newLatLng) || 0;
  console.log("DISTANCE " + distTrav);

  return distTrav;

}




  render() {
    
    if(!this.state.loading){
    return (
      <Grid>
        <View style = {styles.header}>
      <Text style = {styles.headerText}> Pawsition </Text>
    </View>
        <Row size={2}>
        <View>
        <Text style={styles.textDesign}> Your Dog is {this.state.distanceFromHome} metres away from your home co-ordinates</Text>
        <Text style={styles.textDesign2}> Your Dog's Location: </Text>
        <Toast ref={(toast) => this.toast = toast} position={'top'} style={{backgroundColor:'#621FF7'}, {padding: 15}, {height: 300}, {width: 250}} fadeInDuration={750} fadeOutDuration={1000} opacity={0.8}/>
        
      
      <View style={styles.container}>
      <MapView style={styles.map}
        region={this.state.region}
        zoomEnabled = {true}
        onRegionChange={this.onRegionChange}
      >

<MapView.Marker
            coordinate={{latitude: this.state.region.latitude,
            longitude: this.state.region.longitude}}
            title={this.state.region.latitude + "," + this.state.region.longitude}
            description={"Your Dog's Location"}
            pinColor={"#621FF7"}
         />

<MapView.Circle
        center={{
          latitude: this.state.homeLat,
          longitude: this.state.homeLng,
        }}
        radius={this.state.radius}
        strokeWidth={2}
        strokeColor="white"
        fillColor="#e0403a"
      />
      </MapView>
    
        
      </View>  
      </View>
        </Row>     
        
        <Row backgroundColor={'white'} size={2}>
        <View style={styles.stepCircle}>
        <Pedometer/>
        </View>
        </Row>
      </Grid>
      
    );
      }

    else
    {
      return(     
      <View>
      <View style = {styles.header}>
      <Text style = {styles.headerText}> Pawsition </Text>
    </View>
          <Text style = {styles.loadingText}> Loading.... </Text>
        </View>
      );
    }
  }
}


const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    position: 'absolute',
    top: 50,
    width:400,
    height:250,
    left: 0,
    right: 0,
    bottom: 0,
  },

  header:{
 backgroundColor:'#621FF7',
 height: '10%',
 top: 20,
 color: 'white',
 textAlign: 'center'
  },

  headerText:{
    color: 'white',
    textAlign: 'center',
    fontSize: 15,
    top: 10,
    fontWeight: 'bold'
  },

  loadingText:{
    position: 'relative',
    top: 100,
    textAlign: 'center'
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: "center",
    marginHorizontal: 10
  },

  stepCircle:{
    display:'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'

  },

  distanceCircle:{
    width: 90,
    height: 90,
    borderRadius: 90 / 2,
    backgroundColor: '#621FF7',
    position: 'absolute',
    top: 220,
    left: 20,
  },

  caloriesCircle:{
    width: 70,
    height: 70,
    borderRadius: 70 / 2,
    backgroundColor: '#621FF7',
    position: 'absolute',
    top: 220,
    left: 165,
  },

  activeCircle:{
    width: 70,
    height: 70,
    borderRadius: 70 / 2,
    backgroundColor: '#621FF7',
    position: 'absolute',
    top: 220,
    left: 300,
  },

  bubble: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.7)",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20
  },

  buttonContainer: {
    flexDirection: "row",
    marginVertical: 30,
    backgroundColor: "transparent"
  },
  geofence: {
    position: 'relative',
    top: -150,
    width: 400,
    height: 200,
    left: 0,
    right: 0,
    bottom: 0,
  },

  toastDesign:{
    position: 'relative',
    top: -150,
    width: 400,
    height: 200,
    left: 0,
    right: 0,
    bottom: 0,
  },

  textFormat:{
    position: 'relative',
    top: 50,
    width: 400,
    height: 200,
    left: 0,
    right: 0,
    bottom: 0,
  },
  textDesign:{
    fontWeight: 'bold',
    color: '#621FF7',
    top: 40
    
  },
  textDesign2:{
    fontWeight: 'bold',
    color: '#621FF7',
    top:40
  },
  circleText:{
    fontWeight: 'bold',
    color: 'black',
    fontSize: 20,
    position: 'absolute',
    top: 15,
    left: 10
  },

  dogText:{
    color: '#621FF7'
  }

});

export default UserScreen;