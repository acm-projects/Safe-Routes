import 'react-native-gesture-handler';
import React, { Component, useState } from 'react';
import {
  StyleSheet,
  Button,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native';

import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
//import { getDirections, _createRouteCoordinates } from './DirectionsAPI';
import MapViewDirections from 'react-native-maps-directions';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const GOOGLE_MAPS_APIKEY = 'AIzaSyDPlSDDWDMtQWbBiPCC5_zOMHYt0SD8LDU'; //Enter the API key here. Remove it before pushing to GitHub.
const origin = "The+University+of+Texas+at+Dallas,+800+W+Campbell+Rd,+Richardson,+TX+75080";
const destination = "Cityline%2FBush,+East+President+George+Bush+Highway,+Richardson,+TX";

//createStackNavigator allows us to navigate between screens which are stored on a stack. When you go back to the previous screen
//the current one is popped off the stack and the last one is accessed. When you call navigation.navigate() a new screen is pushed
//onto the stack. Allows going back multiple times to whatever screen you were on previously.
const Stack = createStackNavigator();

//Each screen on the app is a function that returns the components that should be displayed to the screen.
//Pass navigation to each app screen function to allow you to call things like navigation.navigate() and move to different screens.
function MapScreen({ route, navigation }) {
    const [markerLocation, setMarkerLocation] = useState({
      markers: [{
        coordinates: {
          latitude: 32.9928297,
          longitude: -96.75095189999999,
        },
      },
      {
        coordinates: {
          latitude: 33.0016756,
          longitude: -96.70317690000002,
        },
      }]
    });
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
          <MapView.Marker
            coordinate={markerLocation.markers[0].coordinates}
          />
          <MapView.Marker
            coordinate={markerLocation.markers[1].coordinates}
          />
          <MapViewDirections
            origin={markerLocation.markers[0].coordinates}
            destination={markerLocation.markers[1].coordinates}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={4}
            strokeColor="#ff2063"
          />
        </MapView>
        <Button
          color = "#ff2063"
          title="Create Route"
          onPress={() => navigation.navigate('Create Route', {setMarkerLocation})}
        />
      </View>
    );
}

function CreateRouteScreen() {
  return (
    <View style={{ flex: 1, flexDirection: 'column',}}>
      <View style={{ flex: 2, backgroundColor: '#f7dfe6'}} behavior="padding" enabled>
        <Text style={{ fontSize: 18 }}> From </Text>
          <TextInput
            style={{ height: 40 }}
            placeholder = 'Latitude'
            keyboardType = 'numeric'
            onChangeText={text => {setMarkerLocation({
              markers: [{
                coordinates: {
                  latitude: text,
                },
              },
              {
                coordinates: {
                  latitude: 33.0016756,
                  longitude: -96.70317690000002,
                },
              }]
            });}}
          />
          <TextInput
            style={{ height: 40 }}
            placeholder = 'Longitude'
            keyboardType = 'numeric'
            onChangeText={text => {setMarkerLocation({
              markers: [{
                coordinates: {
                  longitude: text,
                },
              },
              {
                coordinates: {
                  latitude: 33.0016756,
                  longitude: -96.70317690000002,
                },
              }]
            });}}
          />
      </View>
      <View style={{ flex: 2, backgroundColor: '#ff2063'}}>
        <Text style={{ fontSize: 18 }}> To </Text>
      </View>
      <View style={{ flex: 5 }}>
        <Text style={{ fontSize: 18 }}> Recommended Routes </Text>
      </View>
    </View>
  );
}

//This is the class for our app. Just contains the navigation stuff.
export default class App extends Component {
  render(){
    return(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Map" component={MapScreen} options={{
            headerShown: false
          }}/>
          <Stack.Screen name="Create Route" component={CreateRouteScreen} options={{
            headerTitleStyle: {
              fontFamily: 'Varela', //tried to use a custom font but it is not working so far
            },
          }}/>
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

//Styles can be declared here instead of inline so that they are easier to maintain.
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  map: {
    flex: 1
  },
  text:{

  },
});
