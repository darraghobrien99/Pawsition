// screens/RegisterDogScreen.js

import React, { Component } from 'react';
import { Button, StyleSheet, TextInput, ScrollView, ActivityIndicator, View } from 'react-native';
import firebase from '../database/firebaseDb';

class RegisterDogScreen extends Component {
  constructor() {
    super();
    this.dbRef = firebase.firestore().collection('geofences');
    this.state = {
      geofenceName: '',
      lat: 0.0,
      lng: 0.0,
      radius: 0
    };
  }

  inputValueUpdate = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }

  storeGeofence() {
    if(this.state.geofenceName === ''){
     alert("Please enter your geofence name!")
    } else {
      this.setState({
        isLoading: true,
      });      
      this.dbRef.doc("Home").set({
        geofenceName: this.state.geofenceName,
        lat: parseFloat(this.state.lat),
        lng: parseFloat(this.state.lng),
        radius: parseInt(this.state.radius),
      }).then((res) => {
        this.setState({
          geofenceName: '',
          lat: 0.0,
          lng: 0.0,
          radius: 0,
          isLoading: false,
        });
        this.props.navigation.navigate('UserScreen')
      })
      .catch((err) => {
        console.error("Error found: ", err);
        this.setState({
          isLoading: false,
        });
      });
    }
  }

  render() {
    if(this.state.isLoading){
      return(
        <View style={styles.preloader}>
          <ActivityIndicator size="large" color="#9E9E9E"/>
        </View>
      )
    }
    return (
      <ScrollView style={styles.container}>
        <View style={styles.inputGroup}>
          <TextInput
              placeholder={'Geofence Name'}
              value={this.state.geofenceName}
              onChangeText={(val) => this.inputValueUpdate(val, 'geofenceName')}
          />
        </View>
        <View style={styles.inputGroup}>
          <TextInput
              placeholder={'Latitude'}
              value={this.state.lat}
              keyboardType= "numeric"
              onChangeText={(val) => this.inputValueUpdate(val, 'lat')}
          />
        </View>
        <View style={styles.inputGroup}>
          <TextInput
              placeholder={'Longitude'}
              value={this.state.lng}
              keyboardType= "numeric"
              onChangeText={(val) => this.inputValueUpdate(val, 'lng')}
          />
        </View>
        <View style={styles.inputGroup}>
          <TextInput
              placeholder={'Radius (m)'}
              value={this.state.radius}
              keyboardType= "numeric"
              onChangeText={(val) => this.inputValueUpdate(val, 'radius')}
          />
        </View>
        <View style={styles.button}>
          <Button
            title='Register Geofence'
            onPress={() => this.storeGeofence()} 
            color="#19AC52"
          />
        </View>
      </ScrollView>
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

export default RegisterDogScreen;