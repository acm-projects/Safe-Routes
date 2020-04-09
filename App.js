/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

//This is an example code to understand HTTP Requests//
import React, { Component } from 'react';
//import react in our code.

import { StyleSheet, View, Button, Alert} from 'react-native';
//import all the components we are going to use.

export default class App extends Component {

  getDataUsingGet(){
    //GET request
    fetch('http://api.openweathermap.org/data/2.5/weather?q=Dallas&appid=', {
        method: 'GET'
        //Request Type
    })
    .then((response) => response.json())
    //If response is in json then in success
    .then((responseJson) => {
        //Success
        alert(JSON.stringify(responseJson));
        console.log(responseJson);
    })
    //If response is not in json then in error
    .catch((error) => {
        //Error
        alert(JSON.stringify(error));
        console.error(error);
    });
  }

  render() {
      return (
        <View style={styles.MainContainer}>
          {/*Running GET Request*/}
          <Button title="Get Data Using GET" onPress={this.getDataUsingGet} />
        </View>
      );
    }
  }