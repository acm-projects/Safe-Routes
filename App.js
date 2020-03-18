import 'react-native-gesture-handler';
import React, { Component, useState } from 'react';
import {
  ActivityIndicator,
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

//Custom style for the Google Maps API. I tried tweaking the original to make Safe Routes' map stand out a bit.
//Create your own with mapstyle.withgoogle.com and snazzymaps.com
mapStyle = [
  {
    "featureType": "landscape.natural",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "saturation": 40
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#9a9b93"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#0071c4"
      }
    ]
  }
]

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
    if(typeof route.params !== 'undefined') {
      //If statement below makes sure setLocation is only called once when the current marker position does not match the updated one passed in.
      //Otherwise, setLocation will call the function again and begin an infinite loop.
      if(location != route.params.newMarkerCoords)
          setLocation(route.params.newMarkerCoords);

      return (
        <View style={styles.container}>
          <MapView
            provider={PROVIDER_GOOGLE} // remove if not using Google Maps
            style={styles.map}
            customMapStyle = {mapStyle}
            showsUserLocation = {true}
            followUserLocation = {false}
            region={{
            latitude: location.markers[0].coordinates.latitude,
            longitude: location.markers[0].coordinates.longitude,
            latitudeDelta: Math.abs(location.markers[0].coordinates.latitude - location.markers[1].coordinates.latitude),
            longitudeDelta: Math.abs(location.markers[0].coordinates.longitude - location.markers[1].coordinates.longitude),
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

    else return(
      <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={styles.map}
          customMapStyle = {mapStyle}
          showsUserLocation = {true}
          followUserLocation = {false}
          region={{
          latitude: 32.9857619,
          longitude: -96.7500993,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}/>
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
  const [geocodingData, setGeocodingData] = React.useState({
    inputs: ["",""],
    loading: [false,false],
    responseJson: [undefined,undefined]
  });
  var loadingWheelFrom = (geocodingData.loading[0] == true) ? <ActivityIndicator color="#ff2063"/> : <View/>; //renders a loading wheel if the origin geocoding api call is not complete, renders nothing otherwise
  var loadingWheelTo = (geocodingData.loading[1] == true) ? <ActivityIndicator color='#f7dfe6'/> : <View/>; //renders a loading wheel if the destination geocoding api call is not complete, renders nothing otherwise
  var latLongReadoutFrom;
  var latLongReadoutTo;
  if (geocodingData.responseJson[0] != undefined && geocodingData.responseJson[0].status === "OK") {
    let llrstr = geocodingData.responseJson[0].results[0].geometry.location.lat + ", " + geocodingData.responseJson[0].results[0].geometry.location.lng;
    latLongReadoutFrom = <Text style={styles.latLongReadout}>{llrstr}</Text>;
  } else {
    latLongReadoutFrom = <View/>;
  }
  if (geocodingData.responseJson[1] != undefined && geocodingData.responseJson[1].status === "OK") {
    let llrstr = geocodingData.responseJson[1].results[0].geometry.location.lat + ", " + geocodingData.responseJson[1].results[0].geometry.location.lng;
    latLongReadoutTo = <Text style={styles.latLongReadout}>{llrstr}</Text>;
  } else {
    latLongReadoutTo = <View/>;
  }
  return (
    <View style={{ flex: 1, flexDirection: 'column',}}>
    <Text style={{ fontSize: 20 }}> Create Route </Text>
      <View style={{ flex: 2, backgroundColor: '#f7dfe6'}} behavior="padding" enabled>
        <View style = {{ flexDirection: 'row' }}>
          <Text style={{ fontSize: 18 }}> From </Text>
          {loadingWheelFrom}
        </View>
          <TextInput
            style={{ height: 40 }}
            placeholder = 'Origin'
            keyboardType = 'default'
            onChangeText = {text => {
              setGeocodingData({
                inputs: [text, geocodingData.inputs[1]],
                loading: [geocodingData.loading[0],geocodingData.loading[1]],
                responseJson: [geocodingData.responseJson[0],geocodingData.responseJson[1]]
              });
            }}
            onEndEditing = {event => {
              setGeocodingData({
                inputs: [geocodingData.inputs[0],geocodingData.inputs[1]],
                loading: [true,geocodingData.loading[1]], //the state should reflect that the data fetch is incomplete
                responseJson: [geocodingData.responseJson[0],geocodingData.responseJson[1]]
              });
              //encodeURIComponent encodes the text in a way that is valid for the API request. For example, a space becomes %20.
              var apiRequestAddress = encodeURIComponent(geocodingData.inputs[0]);
              //fetch() is how we can make HTTP API calls. Below, the Google Maps Geocoding API is called. The JSON returned by Google is already a JavaScript object,
              //so the data is really easy to access. Info about accessing the Geocoding API is at https://developers.google.com/maps/documentation/geocoding/intro#GeocodingRequests
              //Getting stuff from an API is asynchronous so that is what the .then is for, it is a callback.
                fetch('https:/' + '/maps.googleapis.com/maps/api/geocode/json?address=' + apiRequestAddress + '&key=' + GOOGLE_MAPS_APIKEY)
                .then((response) => response.json())
                .then((responseJson) => {
                  setGeocodingData({
                    inputs: [responseJson.results[0].formatted_address, geocodingData.inputs[1]],
                    loading: [false, geocodingData.loading[1]],
                    responseJson: [responseJson, geocodingData.responseJson[1]]
                  });
                  if (responseJson.status === "OK") {
                    setPass({
                      markers: [{
                        coordinates: {
                          latitude: responseJson.results[0].geometry.location.lat, //set the first marker's coordinates to the new ones
                          longitude: responseJson.results[0].geometry.location.lng,
                        },
                      },
                      {
                        coordinates: {
                          latitude: pass.markers[1].coordinates.latitude, //keep these the same
                          longitude: pass.markers[1].coordinates.longitude,
                        },
                      }]
                    });
                  }
                })
                .catch((error) => {
                  console.error(error);
                });
            }
          }
          value = {geocodingData.inputs[0]}
          />
          {latLongReadoutFrom}
      </View>
      <View style={{ flex: 2, backgroundColor: '#ff2063'}}>
        <View style = {{ flexDirection: 'row' }}>
          <Text style={{ fontSize: 18 }}> To </Text>
          {loadingWheelTo}
        </View>
        <TextInput
          style={{ height: 40 }}
          placeholder = 'Destination'
          keyboardType = 'default'
          onChangeText = {text => {
            setGeocodingData({
              inputs: [geocodingData.inputs[0],text],
              loading: [geocodingData.loading[0],geocodingData.loading[1]],
              responseJson: [geocodingData.responseJson[0],geocodingData.responseJson[1]]
            });
          }}
          onEndEditing={event => {
            setGeocodingData({
              inputs: [geocodingData.inputs[0], geocodingData.inputs[1]],
              loading: [geocodingData.loading[0], true], //the state should reflect that the data fetch is incomplete
              responseJson: [geocodingData.responseJson[0], geocodingData.responseJson[1]]
            });
            //encodeURIComponent encodes the text in a way that is valid for the API request. For example, a space becomes %20.
            var apiRequestAddress = encodeURIComponent(geocodingData.inputs[1]);
            fetch('https:/' + '/maps.googleapis.com/maps/api/geocode/json?address=' + apiRequestAddress + '&key=' + GOOGLE_MAPS_APIKEY)
            .then((response) => response.json())
            .then((responseJson) => {
              setGeocodingData({
                inputs: [geocodingData.inputs[0], responseJson.results[0].formatted_address],
                loading: [geocodingData.loading[0], false],
                responseJson: [geocodingData.responseJson[0], responseJson]
              });
              if (responseJson.status === "OK") {
                setPass({
                  markers: [{
                    coordinates: {
                      latitude: pass.markers[0].coordinates.latitude, //keep these the same
                      longitude: pass.markers[0].coordinates.longitude,
                    },
                  },
                  {
                    coordinates: {
                      latitude: responseJson.results[0].geometry.location.lat, //set the second marker's coordinates to the new ones
                      longitude: responseJson.results[0].geometry.location.lng,
                    },
                  }]
                });
              }
            })
            .catch((error) => {
              console.error(error);
            });
          }
        }
        value = {geocodingData.inputs[1]}
        />
        {latLongReadoutTo}
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
  latLongReadout: {
    color: '#777777',
    fontSize: 10,
    marginLeft: 10
  },
  container: {
    flex: 1
  },
  map: {
    flex: 1
  },
  text:{

  },
});
