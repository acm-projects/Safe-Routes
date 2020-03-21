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

import MapView, {Polyline} from 'react-native-maps';
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
//This library from Mapbox provides a decoding function to decode the overview_polyline string returned by the Google Directions API.
var polyline = require('@mapbox/polyline');

//Each screen on the app is a function that returns the components that should be displayed to the screen.
//Pass navigation to each app screen function to allow you to call things like navigation.navigate() and move to different screens.
//Route parameter contains all the other stuff that you might want to pass into the MapScreen.
function MapScreen({ route, navigation }) {
    if(typeof route.params !== 'undefined' && route.params.newRouteInfo != undefined) {

      var roadList = [];
      route.params.newRouteInfo.legs[0].steps.forEach(function(entry, index) {
        let instructions = entry.html_instructions;
        let indexOfBTag = instructions.search("<b>");
        while(indexOfBTag !== -1){
          let indexOfExit = instructions.search("exit"); //Check to see if the next bolded part is an exit. If it is, get rid of it entirely because the exit will get counted as a road otherwise.
          if(indexOfExit !== -1 && indexOfExit < indexOfBTag) {
            let indexOfClosingBTag = instructions.search("</b>");
            instructions = instructions.substring(indexOfClosingBTag + 3);
            indexOfBTag = instructions.search("<b>");
            continue;
          }
          instructions = instructions.substring(indexOfBTag + 3);
          let indexOfClosingBTag = instructions.search("</b>");
          if(indexOfClosingBTag === -1) break;
          let boldedString = instructions.substring(0, indexOfClosingBTag);
          //in bolded parts of html_instructions, road names have spaces between them. If this string has a space (and you checked to make sure it's not an exit already), it's a road. Also check to ensure no duplicates.
          if(boldedString.search(" ") != -1  && roadList.indexOf(boldedString) === -1)
            roadList.push(boldedString);
          indexOfBTag = instructions.search("<b>");
        }
      });
      alert(roadList);

      var polylineCoordinates = polyline.decode(route.params.newRouteInfo.overview_polyline.points);
      let polylineCoordinatesLatLng = polylineCoordinates.map((point, index) => {
            return  {
                latitude : point[0],
                longitude : point[1]
            }
        })
      return (
        <View style = {styles.container}>
          <MapView
            provider="google" // remove if not using Google Maps
            style={styles.map}
            customMapStyle = {mapStyle}
            showsUserLocation = {true}
            followUserLocation = {false}
            region={{
            latitude: route.params.newRouteInfo.legs[0].start_location.lat,
            longitude: route.params.newRouteInfo.legs[0].start_location.lng,
            latitudeDelta: Math.abs(route.params.newRouteInfo.legs[0].start_location.lat - route.params.newRouteInfo.legs[0].end_location.lat),
            longitudeDelta: Math.abs(route.params.newRouteInfo.legs[0].start_location.lng - route.params.newRouteInfo.legs[0].end_location.lng),
            }}>
            <MapView.Marker
              coordinate={{latitude: route.params.newRouteInfo.legs[0].start_location.lat, longitude: route.params.newRouteInfo.legs[0].start_location.lng}}
            />
            <MapView.Marker
              coordinate={{latitude: route.params.newRouteInfo.legs[0].end_location.lat, longitude: route.params.newRouteInfo.legs[0].end_location.lng}}
            />
            <Polyline
              coordinates = {polylineCoordinatesLatLng}
              strokeWidth={4}
              strokeColor="#ff2063"
            />
          </MapView>
          <TouchableOpacity
            style = {styles.createRouteButton}
            onPress={() => navigation.navigate('Create Route')}>
            <Text style = {styles.createRouteButtonText}>Create Route</Text>
          </TouchableOpacity>
        </View>
      );
    }

    else return(
      <View style = {styles.container}>
        <MapView
          provider="google" // remove if not using Google Maps
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
        <TouchableOpacity
          style = {styles.createRouteButton}
          onPress={() => navigation.navigate('Create Route')}>
          <Text style = {styles.createRouteButtonText}>Create Route</Text>
        </TouchableOpacity>
      </View>
    );
}

function CreateRouteScreen({ route, navigation }) {
  //Create a state to pass to the next screen when you navigate to it. This state is called routeData. It can be changed using the setRouteData function.
  //Use the React useState hook to create a state outside of a class. React.useState returns an array with 2 values: the current state (routeData), and a function to update it (setRouteData).
  //Calling useState multiple times does nothing, useState should only be called once and then the state should be changed with setRouteData.
  const [routeData, setRouteData] = React.useState(undefined);
  const [geocodingData, setGeocodingData] = React.useState({
    inputs: ["",""],
    loading: [false,false],
    responseJson: [undefined,undefined],
    newLocationLoaded: false //flag that stops infinite direction requests from being executed. True only if a new location has been loaded and a direction request has not been made with it yet.
  });
  const [dropdowns, setDropdowns] = React.useState([false,false,false]);

  var loadingWheelFrom = (geocodingData.loading[0] == true) ? <ActivityIndicator color="#ff2063"/> : <View/>; //renders a loading wheel if the origin geocoding api call is not complete, renders nothing otherwise
  var loadingWheelTo = (geocodingData.loading[1] == true) ? <ActivityIndicator color='#f7dfe6'/> : <View/>; //renders a loading wheel if the destination geocoding api call is not complete, renders nothing otherwise
  var latLongReadoutFrom;
  var latLongReadoutTo;
  var readyToRequestDirections = true;

  //The mess of if-else statements below checks if the origin and destination are valid, if so their latitudes and longitudes will be displayed, if not they will not be displayed and readyToRequestDirections will reflect that a Directions API request should not be made yet.
  if (geocodingData.responseJson[0] != undefined && geocodingData.responseJson[0].status === "OK") {
    let llrstr = geocodingData.responseJson[0].results[0].geometry.location.lat + ", " + geocodingData.responseJson[0].results[0].geometry.location.lng;
    latLongReadoutFrom = <Text style={styles.latLongReadout}>{llrstr}</Text>;
  }
  else {
    latLongReadoutFrom = <View/>;
    readyToRequestDirections = false;
  }
  if (geocodingData.responseJson[1] != undefined && geocodingData.responseJson[1].status === "OK") {
    let llrstr = geocodingData.responseJson[1].results[0].geometry.location.lat + ", " + geocodingData.responseJson[1].results[0].geometry.location.lng;
    latLongReadoutTo = <Text style={styles.latLongReadout}>{llrstr}</Text>;
  }
  else {
    latLongReadoutTo = <View/>;
    readyToRequestDirections = false;
  }
  if(!geocodingData.newLocationLoaded) readyToRequestDirections = false;

  if(readyToRequestDirections){
    setGeocodingData({
      inputs: [geocodingData.inputs[0], geocodingData.inputs[1]],
      loading: [geocodingData.loading[0],geocodingData.loading[1]],
      responseJson: [geocodingData.responseJson[0],geocodingData.responseJson[1]],
      newLocationLoaded: false
    });
    fetch('https://maps.googleapis.com/maps/api/directions/json?origin=place_id:' + geocodingData.responseJson[0].results[0].place_id + '&destination=place_id:' + geocodingData.responseJson[1].results[0].place_id + '&alternatives=true&key=' + GOOGLE_MAPS_APIKEY)
    .then((response) => response.json())
    .then((responseJson) => {
      setRouteData(responseJson);
    })
    .catch((error) => {
      console.error(error);
    });
  }

  //if routes have been received from the Directions API, create a view to display each of them which, when clicked,
  //will send the appropriate route info to the map screen and navigate there so the user can view the route.
  var routesDisplay = [];
  if(typeof routeData !== "undefined"){
    if(routeData.status === "OK"){
      routeData.routes.forEach(function(entry, index) {
        routesDisplay[index] =
        <View key = {index} style = {styles.routesDisplays}>
          <TouchableOpacity style = {{flexDirection: 'row', padding: 5, flex: 2, backgroundColor: '#f7dfe6'}} onPress={() => {navigation.navigate('Map', {newRouteInfo: routeData.routes[index]});} }>
            <View style = {{flex: 8}}>
              <Text>{entry.summary}</Text>
              <Text style={{ fontSize: 12 }}>{entry.legs[0].distance.text}</Text>
              <Text style={{ fontSize: 12 }}>{entry.legs[0].duration.text}</Text>
            </View>
            <View style = {{flex: 2, justifyContent:'center', alignItems: 'center'}}>
              <Text style={styles.ratingLetter}>F</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style = {{alignItems: "center", justifyContent: "center", backgroundColor: "#ff2063", flex: 1}} onPress={() => {
            let currentDropdownState = dropdowns;
            currentDropdownState[index] = true;
            setDropdowns(currentDropdownState);
          }}>
            <Text style = {styles.viewAnalysis}>▽ View safety analysis</Text>
          </TouchableOpacity>
        </View>;
      });
    }
  }
  return (
    <View style={{ flex: 1, flexDirection: 'column',}}>
    <Text style={{ fontFamily: 'Varela-Regular',  fontSize: 20 }}> Create Route </Text>
      <View style={{ flex: 2, backgroundColor: '#f7dfe6', padding: 3}}>
        <View style = {{ flexDirection: 'row' }}>
          <Text style={{ fontFamily: 'Varela-Regular', fontSize: 18 }}> From </Text>
          {loadingWheelFrom}
          {latLongReadoutFrom}
        </View>
          <TextInput
            style={{ fontFamily: 'Varela-Regular', height: 40 }}
            placeholder = 'Origin'
            keyboardType = 'default'
            onChangeText = {text => {
              setGeocodingData({
                inputs: [text, geocodingData.inputs[1]],
                loading: [geocodingData.loading[0],geocodingData.loading[1]],
                responseJson: [geocodingData.responseJson[0],geocodingData.responseJson[1]],
                newLocationLoaded: geocodingData.newLocationLoaded
              });
            }}
            onEndEditing = {event => {
              setGeocodingData({
                inputs: [geocodingData.inputs[0],geocodingData.inputs[1]],
                loading: [true,geocodingData.loading[1]], //the state should reflect that the data fetch is incomplete
                responseJson: [geocodingData.responseJson[0],geocodingData.responseJson[1]],
                newLocationLoaded: geocodingData.newLocationLoaded
              });
              //encodeURIComponent encodes the text in a way that is valid for the API request. For example, a space becomes %20.
              var apiRequestAddress = encodeURIComponent(geocodingData.inputs[0]);
              //fetch() is how we can make HTTP API calls. Below, the Google Maps Geocoding API is called. The JSON returned by Google is already a JavaScript object,
              //so the data is really easy to access. Info about accessing the Geocoding API is at https://developers.google.com/maps/documentation/geocoding/intro#GeocodingRequests
              //Getting stuff from an API is asynchronous so that is what the .then is for, it is a callback.
                fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + apiRequestAddress + '&key=' + GOOGLE_MAPS_APIKEY)
                .then((response) => response.json())
                .then((responseJson) => {
                  if(responseJson.status === "OK")
                  setGeocodingData({
                    inputs: [responseJson.results[0].formatted_address, geocodingData.inputs[1]],
                    loading: [false, geocodingData.loading[1]],
                    responseJson: [responseJson, geocodingData.responseJson[1]],
                    newLocationLoaded: true
                  });
                  else
                  setGeocodingData({
                    inputs: ["", geocodingData.inputs[1]],
                    loading: [false, geocodingData.loading[1]],
                    responseJson: [responseJson, geocodingData.responseJson[1]],
                    newLocationLoaded: true
                  });
                })
                .catch((error) => {
                  console.error(error);
                });
            }
          }
          value = {geocodingData.inputs[0]}
          />
      </View>
      <View style={{ flex: 2, backgroundColor: '#ff2063', padding: 3}}>
        <View style = {{ flexDirection: 'row' }}>
          <Text style={{ fontFamily: 'Varela-Regular', fontSize: 18 }}> To </Text>
          {loadingWheelTo}
          {latLongReadoutTo}
        </View>
        <TextInput
          style={{ fontFamily: 'Varela-Regular', height: 40 }}
          placeholder = 'Destination'
          keyboardType = 'default'
          onChangeText = {text => {
            setGeocodingData({
              inputs: [geocodingData.inputs[0],text],
              loading: [geocodingData.loading[0],geocodingData.loading[1]],
              responseJson: [geocodingData.responseJson[0],geocodingData.responseJson[1]],
              newLocationLoaded: geocodingData.newLocationLoaded
            });
          }}
          onEndEditing={event => {
            setGeocodingData({
              inputs: [geocodingData.inputs[0], geocodingData.inputs[1]],
              loading: [geocodingData.loading[0], true], //the state should reflect that the data fetch is incomplete
              responseJson: [geocodingData.responseJson[0], geocodingData.responseJson[1]],
              newLocationLoaded: geocodingData.newLocationLoaded
            });
            //encodeURIComponent encodes the text in a way that is valid for the API request. For example, a space becomes %20.
            var apiRequestAddress = encodeURIComponent(geocodingData.inputs[1]);
            fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + apiRequestAddress + '&key=' + GOOGLE_MAPS_APIKEY)
            .then((response) => response.json())
            .then((responseJson) => {
              if(responseJson.status === "OK")
              setGeocodingData({
                inputs: [geocodingData.inputs[0], responseJson.results[0].formatted_address],
                loading: [geocodingData.loading[0], false],
                responseJson: [geocodingData.responseJson[0], responseJson],
                newLocationLoaded: true
              });
              else
              setGeocodingData({
                inputs: [geocodingData.inputs[0], ""],
                loading: [geocodingData.loading[0], false],
                responseJson: [geocodingData.responseJson[0], responseJson],
                newLocationLoaded: true
              });
            })
            .catch((error) => {
              console.error(error);
            });
          }
        }
        value = {geocodingData.inputs[1]}
        />
      </View>
      <View style={{ flex: 6 }}>
        <Text style={{ fontFamily: 'Varela-Regular', fontSize: 18 }}> Recommended Routes </Text>
        <View style={{ paddingTop: 5}}>
          {routesDisplay}
        </View>
      </View>
    </View>
  );
}

//This is the main class for our app. Just contains the navigation stuff.
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
  ratingLetter: {
    fontSize: 30,
    color: 'maroon'
  },
  routesDisplays: {
    height: 90,
  },
  latLongReadout: {
    color: '#777777',
    fontSize: 10,
    marginLeft: 'auto',
    alignSelf: 'center'
  },
  createRouteButton: {
    position: "absolute",
    backgroundColor: "#ff2063",
    height: 40,
    width: 170,
    opacity: .85,
    borderRadius: 20,
    bottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  },
  createRouteButtonText: {
    fontSize: 18,
    color: 'white',
    fontFamily: 'Varela-Regular'
  },
  container: {
     flex: 1,
     flexDirection: "column-reverse",
  },
  map: {
    flex: 1
  },
  viewAnalysis: {
    color: "white",
    fontSize: 12
  }
});
