// screens/RegisterDogScreen.js

import React, { Component } from 'react';
import { Button, StyleSheet, TextInput, ScrollView, ActivityIndicator, View } from 'react-native';
import firebase from '../database/firebaseDb';

class RegisterDogScreen extends Component {
  constructor() {
    super();
    this.dbRef = firebase.firestore().collection('dogs');
    this.state = {
      name: '',
      age: 0,
      weight: 0,
      breed: '',
      isLoading: false
    };
  }


  inputValueUpdate = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }

  storeDog() {
    if(this.state.name === ''){
     alert("Please enter your Dog's name!")
    } else {
      this.setState({
        isLoading: true,
      });      
      this.dbRef.doc(this.state.name).set({
        name: this.state.name,
        age: parseInt(this.state.age),
        weight: parseInt(this.state.weight),
        breed: this.state.breed,
      }).then((res) => {
        this.setState({
          name: '',
          age: 0,
          weight: 0,
          breed: '',
          isLoading: false,
        });
       // this.props.navigation.navigate('UserScreen')
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
              placeholder={'Name'}
              value={this.state.name}
              onChangeText={(val) => this.inputValueUpdate(val, 'name')}
          />
        </View>
        <View style={styles.inputGroup}>
          <TextInput
              multiline={true}
              placeholder={'Age'}
              value={this.state.age}
              keyboardType= "numeric"
              onChangeText={(val) => this.inputValueUpdate(val, 'age')}
          />
        </View>
        <View style={styles.inputGroup}>
          <TextInput
              placeholder={'Weight in KG'}
              value={this.state.weight}
              keyboardType= "numeric"
              onChangeText={(val) => this.inputValueUpdate(val, 'weight')}
          />
        </View>
        <View style={styles.inputGroup}>
          <TextInput
              placeholder={'Breed'}
              value={this.state.breed}
              onChangeText={(val) => this.inputValueUpdate(val, 'breed')}
          />
        </View>
        <View style={styles.button}>
          <Button
            title='Register Dog'
            onPress={() => this.storeDog()} 
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