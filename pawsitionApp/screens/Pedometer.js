// screens/UserScreen.js

import React, { Component, useState } from 'react';
import { StyleSheet, TouchableOpacity, Button, View, Text, Platform, Image, ActivityIndicator} from 'react-native';
import { textAlign } from 'styled-system';
import firebase from '../database/firebaseDb';

class Pedometer extends Component {
  constructor(props) {
    super(props);
    this.state = {
        stepCount: 0,
        loading:true,
        calories: 0.02,
        totalCalories: 0,
    };
    this.readStepCount = this.readStepCount.bind(this);
    
  }



 async componentDidMount() {
    this.updateTimer = setInterval(() => this.readStepCount(), 10000);
   // this.updateTimer2 = setInterval(() => this.calculateDistance(), 30000);
  }

  componentWillMount(){
    clearInterval(this.updateTimer);
  }


 // Get Data from Firebase 
 async readStepCount() {

   let stepCount = 0;
   
  firebase.database().ref('/steps').on('value', function (snapshot) {
     stepCount =  snapshot.val();
  });

  if(!isNaN(stepCount)){
  await this.setState({stepCount: stepCount,
    loading:false,
    totalCalories: stepCount * this.state.calories});

  console.log(stepCount);
}

//this.state.totalCalories = this.state.totalCalories.toFixed(2);
 }

  render() {


    if(!this.state.loading){
    return (
        <View style={styles.stepCount}>
             <Text style={styles.textDesign2}> Steps: {"\n"}</Text> 
            <Text style={styles.textDesign}> {this.state.stepCount} </Text>
        </View>
      
    );
            }

    else{
      return(
        <View style={styles.stepCount}>
          <Text> Loading.... </Text>
        </View>
      );
    }
  }
}


const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
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

  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: "center",
    marginHorizontal: 10
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

  stepCount:{
    justifyContent: 'center',
    alignItems: 'center',
    width: 200,
    height: 200,
    borderRadius: 200 / 2,
    backgroundColor: '#621FF7'
  },

  textDesign:{
    fontWeight: 'bold',
    color: 'white',
    fontSize: 30,
    marginTop:0,
    width: 200,
    textAlign: 'center'

  },
  textDesign2:{
    fontWeight: 'bold',
    color: 'white',
    fontSize: 20,
    textAlign: 'center'
  },

  textDesign3:{
    fontWeight: 'bold',
    color: 'white',
    fontSize: 20,
    top: 180,
   // left: -135
  }
});

export default Pedometer;