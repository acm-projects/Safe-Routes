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

const GOOGLE_MAPS_APIKEY = ''; //Enter the API key here. Remove it before pushing to GitHub.
const origin = "The+University+of+Texas+at+Dallas,+800+W+Campbell+Rd,+Richardson,+TX+75080";
const destination = "Cityline%2FBush,+East+President+George+Bush+Highway,+Richardson,+TX";

//createStackNavigator allows us to navigate between screens which are stored on a stack. When you go back to the previous screen
//the current one is popped off the stack and the last one is accessed. When you call navigation.navigate() a new screen is pushed
//onto the stack. Allows going back multiple times to whatever screen you were on previously.
const Stack = createStackNavigator();

//Each screen on the app is a function that returns the components that should be displayed to the screen.
//Pass navigation to each app screen function to allow you to call things like navigation.navigate() and move to different screens.
//Route parameter contains all the other stuff that you might want to pass into the MapScreen.
function MapScreen({ route, navigation }) {
    var [location, setLocation] = useState({
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
    if(typeof route.params !== 'undefined'){
      //If statement below makes sure setLocation is only called once when the current marker position does not match the updated one passed in.
      //Otherwise, setLocation will call the function again and begin an infinite loop.
      if(location != route.params.newMarkerCoords)
          setLocation(route.params.newMarkerCoords);
      }
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
            coordinate={location.markers[0].coordinates}
          />
          <MapView.Marker
            coordinate={location.markers[1].coordinates}
          />
          <MapViewDirections
            origin={location.markers[0].coordinates}
            destination={location.markers[1].coordinates}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={4}
            strokeColor="#ff2063"
            precision="high" //Apparently setting this to high this makes the route line more accurate. Why not?
          />
        </MapView>
        <Button
          color = "#ff2063"
          title="Create Route"
          onPress={() => navigation.navigate('Create Route')}
        />
      </View>
    );
}

function CreateRouteScreen({ route, navigation }) {
  //Create a state to pass to the next screen when you navigate to it. This state is called pass. It can be changed using the setPass function.
  //Use the React useState hook to create a state outside of a class. React.useState returns an array with 2 values: the current state (pass), and a function to update it (setPass).
  //Calling useState multiple times does nothing, useState should only be called once and then the state should be changed with setPass.
  const [pass, setPass] = React.useState({
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
    <View style={{ flex: 1, flexDirection: 'column',}}>
    <Text style={{ fontSize: 20}}> Create Route </Text>
      <View style={{ flex: 2, backgroundColor: '#f7dfe6'}} behavior="padding" enabled>
        <Text style={{ fontSize: 18 }}> From </Text>
          <TextInput
            style={{ height: 40 }}
            placeholder = 'Latitude'
            keyboardType = 'numeric'
            onChangeText={text => setPass({
              markers: [{
                coordinates: {
                  latitude: parseFloat(text),
                  longitude: pass.markers[0].coordinates.longitude,
                },
              },
              {
                coordinates: {
                  latitude: pass.markers[1].coordinates.latitude,
                  longitude: pass.markers[1].coordinates.longitude,
                },
              }]
            })}
          />
          <TextInput
            style={{ height: 40 }}
            placeholder = 'Longitude'
            keyboardType = 'numeric'
            onChangeText={text => setPass({
              markers: [{
                coordinates: {
                  latitude: pass.markers[0].coordinates.latitude,
                  longitude: parseFloat(text),
                },
              },
              {
                coordinates: {
                  latitude: pass.markers[1].coordinates.latitude,
                  longitude: pass.markers[1].coordinates.longitude,
                },
              }]
            })}
          />
      </View>
      <View style={{ flex: 2, backgroundColor: '#ff2063'}}>
        <Text style={{ fontSize: 18 }}> To </Text>
        <TextInput
          style={{ height: 40 }}
          placeholder = 'Latitude'
          keyboardType = 'numeric'
          onChangeText={text => setPass({
            markers: [{
              coordinates: {
                latitude: pass.markers[0].coordinates.latitude,
                longitude: pass.markers[0].coordinates.longitude,
              },
            },
            {
              coordinates: {
                latitude: parseFloat(text),
                longitude: pass.markers[1].coordinates.longitude,
              },
            }]
          })}
        />
        <TextInput
          style={{ height: 40 }}
          placeholder = 'Longitude'
          keyboardType = 'numeric'
          onChangeText={text => setPass({
            markers: [{
              coordinates: {
                latitude: pass.markers[0].coordinates.latitude,
                longitude: pass.markers[0].coordinates.longitude,
              },
            },
            {
              coordinates: {
                latitude: pass.markers[1].coordinates.latitude,
                longitude: parseFloat(text),
              },
            }]
          })}
        />
      </View>
      <View style={{ flex: 5 }}>
        <Text style={{ fontSize: 18 }}> Recommended Routes </Text>
      </View>
      <Button
         title="Go back"
         onPress={() => navigation.navigate('Map', {newMarkerCoords: pass})} //Create a parameter called newMarkerCoords and pass the state to it
       />
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
            headerShown: false
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
