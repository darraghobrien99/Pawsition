import React, { Component, useState } from 'react';
import { StyleSheet, Button, View, Text } from 'react-native';
import firebase from '../database/firebaseDb';
import firestore from '@react-native-firebase/firestore';
const haversine = require('haversine');

import HaversineGeolocation from 'haversine-geolocation';

class Geofence extends Component {
    constructor() {
      super();
      this.state = {
        realtimeLat: 0,
        realtimeLng: 0,
        homeLat: 52.16494493,
        homeLng: -9.7787026,
        radius: 50,
        withinGeofence: true,
        distanceFromHome: 0,
      };

      this.readGPSData = this.readGPSData.bind(this);
      this.calculateDistance = this.calculateDistance.bind(this);
      this.timer1 = null;
      this.timer2 = null;
    }

    componentDidMount() {
      this.timer1 = setInterval(() => this.readGPSData(), 30000);
      this.timer2 = setInterval(() => this.calculateDistance(), 30000);
    }
  
    componentWillMount(){
      clearInterval(this.timer1)
      clearInterval(this.timer2)
    }


    //get co-ordinates data from firebase
    async readGPSData() {
        let dogLatitude = '';
        let dogLongitude = '';
       firebase.database().ref('/location/lat').on('value', function (snapshot) {
         dogLatitude =  snapshot.val();
       });
     
       firebase.database().ref('/location/lng').on('value', function (snapshot) {
         dogLongitude =  snapshot.val();
       });
     
       dogLatitude = parseFloat(dogLatitude);
       dogLongitude = parseFloat(dogLongitude);
       await this.setState({
           realtimeLat: dogLatitude,
           realtimeLng: dogLongitude,
       });
     }

     getRadius = (documentSnapshot) => {
      return documentSnapshot.get('radius');
    }
    //get geofence data from firebase
    /*
    async readUserDefinedGeofence(){
      firestore()
      .collection('geofences')
      .doc('wn8p1mafKy1aMOi9KzDF')
      .get()
      .then(documentSnapshot => this.getRadius(documentSnapshot))
      .then(radius => {
        console.log("'Users radius is: ', radius");
        this.setState({radius: radius})
      });
    }

*/

    //calculate distance between 'home' and gps coords
    async calculateDistance(){
      const start = {
        latitude: this.state.homeLat,
        longitude: this.state.homeLng
      }

      const end = {
        latitude: this.state.realtimeLat,
        longitude: this.state.realtimeLng
      }

      const distanceFromHome2 = (haversine(start, end, {unit: 'metre'}))

     // console.log("const distance" + distanceFromHome2);
      this.setState({distanceFromHome: distanceFromHome2});
      console.log("state distance" + this.state.distanceFromHome);
      /*
     const distanceFromBoundary = HaversineGeolocation.getDistanceBetween(points[0], points[1], 'm');
     await this.setState({distanceFromBoundary: distanceFromBoundary});
     console.log(this.state.distanceFromBoundary);
     */

    }

    render() {
      return (
     <View style={styles.container}>
      <Text> Your Dog is {this.state.distanceFromHome} metres from your defined home co-oridinates</Text>
     </View>
      );
  }
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 35
  },
  inputGroup: {
    flex: 1,
    padding: 0,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  preloader: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center'
  }
})
  
  export default Geofence;