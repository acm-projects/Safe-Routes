import 'react-native-gesture-handler';
import React, { Component } from 'react';
import {
  StyleSheet,
  Button,
  Text,
  View,
} from 'react-native';

import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
//import { getDirections, _createRouteCoordinates } from './DirectionsAPI';
import MapViewDirections from 'react-native-maps-directions';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


var coordinates = [
  {
    //UTD
    latitude: 32.9928297,
    longitude: -96.75095189999999,
  },
  {
    //Cityline Bush Station
    latitude: 33.0016756,
    longitude: -96.70317690000002,
  },
];


const GOOGLE_MAPS_APIKEY = 'AIzaSyDPlSDDWDMtQWbBiPCC5_zOMHYt0SD8LDU';
const origin = "The+University+of+Texas+at+Dallas,+800+W+Campbell+Rd,+Richardson,+TX+75080";
const destination = "Cityline%2FBush,+East+President+George+Bush+Highway,+Richardson,+TX";

const Stack = createStackNavigator();

function MapScreen({ navigation }) {
    return (
      <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={styles.map}
          region={{
          latitude: 32.9857619,
          longitude: -96.7500993,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
          }}>
          <MapView.Marker coordinate={coordinates[0]} />
          <MapView.Marker coordinate={coordinates[1]} />

          <MapViewDirections
            origin={coordinates[0]}
            destination={coordinates[1]}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={4}
            strokeColor="hotpink"
          />
        </MapView>
        <Button
          color = "hotpink"
          title="Create Route"
          onPress={() => navigation.navigate('Create Route')}
        />
      </View>
    );
}

function CreateRouteScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Route Screen</Text>
    </View>
  );
}

function App(){
    return(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Map" component={MapScreen} />
          <Stack.Screen name="Create Route" component={CreateRouteScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  map: {
    flex: 1
  },
});

export default App;
