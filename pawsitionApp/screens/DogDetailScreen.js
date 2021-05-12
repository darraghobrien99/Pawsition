// screens/UserDetailScreen.js

import React, { Component } from 'react';
import { Alert, Button, StyleSheet, TextInput, ScrollView, ActivityIndicator, View } from 'react-native';
import firebase from '../database/firebaseDb';

class DogDetailScreen extends Component {

  constructor() {
    super();
    this.state = {
      name: '',
      age: 0,
      weight: 0,
      breed: '',
      isLoading: true
    };
  }
 
  componentDidMount() {
    
  }

  inputValueUpdate = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }

  updateDog() {
    this.setState({
      isLoading: true,
    });
    const updateDBRef = firebase.firestore().collection('dogs').doc(this.state.key);
    updateDBRef.set({
      name: this.state.name,
      age: this.state.age,
      weight: this.state.weight,
      breed: this.state.breed,
    }).then((docRef) => {
      this.setState({
        key: '',
        name: '',
        age: 0,
        weight: 0,
        breed: '',
        isLoading: false,
      });
      this.props.navigation.navigate('UserScreen');
    })
    .catch((error) => {
      console.error("Error: ", error);
      this.setState({
        isLoading: false,
      });
    });
  }

  deleteDog() {
    const dbRef = firebase.firestore().collection('dogs').doc(this.props.route.params.userkey)
      dbRef.delete().then((res) => {
          console.log('Item removed from database')
          this.props.navigation.navigate('UserScreen');
      })
  }

  openTwoButtonAlert=()=>{
    Alert.alert(
      'Delete Dog',
      'Are you sure?',
      [
        {text: 'Yes', onPress: () => this.deleteDog()},
        {text: 'No', onPress: () => console.log('No item was removed'), style: 'cancel'},
      ],
      { 
        cancelable: true 
      }
    );
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
              onChangeText={(val) => this.inputValueUpdate(val, 'age')}
          />
        </View>
        <View style={styles.inputGroup}>
          <TextInput
              placeholder={'Weight'}
              value={this.state.weight}
              onChangeText={(val) => this.inputValueUpdate(val, 'weight')}
          />
        </View>
        <View style={styles.inputGroup}>
          <TextInput
              placeholder={'Breed'}
              value={this.state.breedt}
              onChangeText={(val) => this.inputValueUpdate(val, 'breed')}
          />
        </View>
        <View style={styles.button}>
          <Button
            title='Update'
            onPress={() => this.updateDog()} 
            color="#19AC52"
          />
          </View>
         <View>
          <Button
            title='Delete'
            onPress={this.openTwoButtonAlert}
            color="#E37399"
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
  },
  button: {
    marginBottom: 7, 
  }
})

export default DogDetailScreen;