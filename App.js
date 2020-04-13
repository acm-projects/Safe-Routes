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
  ScrollView,
  Switch,
  Dimensions,
  Image
} from 'react-native';
import RouteOption from './RouteOption';

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

var width = Dimensions.get('window').width; //full screen width
var height = Dimensions.get('window').height; //full screen height

//Custom style for the Google Maps API. I tried tweaking the original to make Safe Routes' map stand out a bit.
//Create your own with mapstyle.withgoogle.com and/or snazzymaps.com
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
  const [navStatus, setNavStatus] = React.useState(0);

    if(typeof route.params !== 'undefined' && route.params.newRouteInfo != undefined) {
      var polylineCoordinates = polyline.decode(route.params.newRouteInfo.overview_polyline.points);
      let polylineCoordinatesLatLng = polylineCoordinates.map((point, index) => {
            return  {
                latitude : point[0],
                longitude : point[1]
            }
        });
      var stepInstructions = route.params.newRouteInfo.legs[0].steps[navStatus].html_instructions;

      //get rid of the stupid html tags
      stepInstructions = stepInstructions.replace(/<b>/g, ""); //remove <b> tag
      stepInstructions = stepInstructions.replace(/<\/b>/g, ""); //remove </b> tag
      stepInstructions = stepInstructions.replace(/<wbr\/>/g, ""); //remove <wbr/> tag
      while(true){
        var openingTagOpener = stepInstructions.indexOf("<");
        var openingTagCloser = stepInstructions.indexOf(">");
        if(openingTagOpener !== -1 && openingTagCloser !== -1){ //if there is a <[tagName] style = ...> remove that whole thing and replace with -
          let firstHalf = stepInstructions.substring(0, openingTagOpener);
          let secondHalf = stepInstructions.substring(openingTagCloser + 1);
          let tagName = stepInstructions.substring(openingTagOpener + 1, openingTagCloser);
          let nameCutOff = tagName.indexOf(" ");
          if(nameCutOff !== -1) tagName = tagName.substring(0, nameCutOff);
          console.log(tagName);
          stepInstructions = firstHalf + " - " + secondHalf;
          stepInstructions = stepInstructions.replace("</" + tagName + ">", ""); //remove </[tagName]> tag
        }
        else break;
      }
      var ampersand = stepInstructions.indexOf("&");
      var semicolon = stepInstructions.indexOf(";");
      if(ampersand !== -1 && semicolon !== -1){ //get rid of the codes between & and ; such as &nbsp;
        let firstHalf = stepInstructions.substring(0, ampersand);
        let secondHalf = stepInstructions.substring(semicolon + 1);
        stepInstructions = firstHalf + " " + secondHalf;
      }

      var stepDistance = route.params.newRouteInfo.legs[0].steps[navStatus].distance.text;
      var stepDuration = route.params.newRouteInfo.legs[0].steps[navStatus].duration.text;
      var stepNumber = (navStatus + 1) + "/" + route.params.newRouteInfo.legs[0].steps.length;
      return (
        <View style = {styles.container}>
          <MapView
            provider="google" // remove if not using Google Maps
            style={styles.map}
            customMapStyle = {mapStyle}
            showsUserLocation = {true}
            followUserLocation = {true}
            region={{
            latitude: (route.params.newRouteInfo.legs[0].steps[navStatus].start_location.lat + route.params.newRouteInfo.legs[0].steps[navStatus].end_location.lat) / 2,
            longitude: (route.params.newRouteInfo.legs[0].steps[navStatus].start_location.lng + route.params.newRouteInfo.legs[0].steps[navStatus].end_location.lng) / 2,
            latitudeDelta: Math.abs(route.params.newRouteInfo.legs[0].steps[navStatus].start_location.lat - route.params.newRouteInfo.legs[0].steps[navStatus].end_location.lat) * 1.1, //*1.1 gives a bit of padding
            longitudeDelta: Math.abs(route.params.newRouteInfo.legs[0].steps[navStatus].start_location.lng - route.params.newRouteInfo.legs[0].steps[navStatus].end_location.lng) * 1.1,
            }}>
            <MapView.Marker
              coordinate={{latitude: route.params.newRouteInfo.legs[0].start_location.lat, longitude: route.params.newRouteInfo.legs[0].start_location.lng}}
              image = {require('./assets/images/markerA.png')}
            />
            <MapView.Marker
              coordinate={{latitude: route.params.newRouteInfo.legs[0].end_location.lat, longitude: route.params.newRouteInfo.legs[0].end_location.lng}}
              image = {require('./assets/images/markerB.png')}
            />
            <MapView.Marker
              coordinate={{latitude: route.params.newRouteInfo.legs[0].steps[navStatus].start_location.lat, longitude: route.params.newRouteInfo.legs[0].steps[navStatus].start_location.lng}}
              image = {require('./assets/images/cartakeoff.png')}
            />
            <MapView.Marker
              coordinate={{latitude: route.params.newRouteInfo.legs[0].steps[navStatus].end_location.lat, longitude: route.params.newRouteInfo.legs[0].steps[navStatus].end_location.lng}}
              image = {require('./assets/images/carlanding.png')}
            />
            <Polyline
              coordinates = {polylineCoordinatesLatLng}
              strokeWidth={4}
              strokeColor="#ff2063"
            />
          </MapView>
          <View style = {styles.navigator}>
            <TouchableOpacity
            style = {{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ff2063'}}
            onPress={() => {setNavStatus(0); navigation.setParams({newRouteInfo: undefined});}}>
              <Text style = {{fontSize: 36, color: 'white'}}>X</Text>
            </TouchableOpacity>
            <View style = {{flex: 6, padding: 4, alignItems: 'center', justifyContent: 'center'}}>
              <ScrollView>
                <Text style = {{fontSize: 18, fontFamily: 'Varela-Regular', textAlign: 'center'}}>{stepInstructions}</Text>
                <Text style = {{textAlign: 'center'}}>{stepDistance}</Text>
                <Text style = {{textAlign: 'center'}}>{stepDuration}</Text>
              </ScrollView>
            </View>
            <View style = {{flex: 3, backgroundColor: "#ff2063", flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
              <View style = {{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Text style = {{fontSize: 30, fontFamily: 'Varela-Regular', color: 'white'}}>{stepNumber}</Text>
              </View>
              <View style = {{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                <TouchableOpacity style = {{flex: 1 , alignItems: 'center', justifyContent: 'center'}}
                  onPress={() => {
                    if(navStatus > 0){
                      setNavStatus(navStatus - 1);
                    }
                  }}>
                  <Image
                    style={styles.stepArrows}
                    source={require('./assets/images/leftarrow.png')}
                  />
                </TouchableOpacity>
                <TouchableOpacity style = {{flex: 1 , alignItems: 'center', justifyContent: 'center'}}
                onPress={() => {
                  if(navStatus < route.params.newRouteInfo.legs[0].steps.length - 1){
                    setNavStatus(navStatus + 1);
                  }
                }}>
                  <Image
                    style={styles.stepArrows}
                    source={require('./assets/images/rightarrow.png')}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      );
    }

    else {
      return(
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
}

function CreateRouteScreen({ route, navigation }) {
  //Create a state to pass to the next screen when you navigate to it. This state is called routeData. It can be changed using the setRouteData function.
  //When the state is changed, the component will rerender.
  //Use the React useState hook to create a state outside of a class. React.useState returns an array with 2 values: the current state (routeData), and a function to update it (setRouteData).
  //Calling useState multiple times does nothing but return the current state, useState should only be called once and then the state should be changed with setRouteData.
  const [routeData, setRouteData] = React.useState(undefined);
  const [geocodingData, setGeocodingData] = React.useState({
    inputs: ["",""],
    loading: [false,false],
    responseJson: [undefined,undefined],
    newLocationLoaded: false //flag that stops infinite direction requests from being executed. True only if a new location has been loaded and a direction request has not been made with it yet.
  });
  const [switchEnabled, setSwitchEnabled] = useState(false);
  const [crashList, setCrashList] = useState(undefined);

  var avoidHighways = "";
  if(switchEnabled) avoidHighways = "&avoid=highways";
  const toggleSwitch = () => {
    setGeocodingData({
      inputs: [geocodingData.inputs[0], geocodingData.inputs[1]],
      loading: [geocodingData.loading[0],geocodingData.loading[1]],
      responseJson: [geocodingData.responseJson[0],geocodingData.responseJson[1]],
      newLocationLoaded: true
    });
    setSwitchEnabled(previousState => !previousState)
  };

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
    fetch('https://maps.googleapis.com/maps/api/directions/json?origin=place_id:' + geocodingData.responseJson[0].results[0].place_id + '&destination=place_id:' + geocodingData.responseJson[1].results[0].place_id + avoidHighways + '&alternatives=true&key=' + GOOGLE_MAPS_APIKEY)
    .then((response) => response.json())
    .then((responseJson) => {
      setRouteData(responseJson);
    })
    .catch((error) => {
      console.error(error);
    });
  }

  //if routes have been received from the Directions API, create a RouteOption to display each of them which, when clicked,
  //will send the appropriate route info to the map screen and navigate there so the user can view the route.
  //Calculate the safety rating for each route.
  var routesDisplay = [];
  if(typeof routeData !== "undefined"){
    if(routeData.status === "OK"){
      if(typeof crashList === "undefined") {
        var initialCrashList = []; //asynchronously becomes populated with every crash that has occurred in DFW counties
        var countyNumberList = [85, 113, 121, 139, 251, 257, 367, 397, 439, 497]; //Collin, Dallas, Denton, Ellis, Johnson, Kaufman, Parker, Rockwall, Tarrant, Wise respectively
        countyNumberList.forEach(function(number, idx) {
          let url = "https://crashviewer.nhtsa.dot.gov/CrashAPI/crashes/GetCrashesByLocation?fromCaseYear=2018&toCaseYear=2019&state=48&county=" + number + "&format=json";
          fetch(url)
          .then((response) => response.json())
          .then((responseJson) => {
            responseJson.Results[0].forEach(function(entry,index) {
              for(var i = 0; i < 2; i++) { //run this code twice for each result since there may be a TWAY_ID2 (secondary road name)
                var roadName;
                if(i === 0) roadName = entry.TWAY_ID;
                  else if(i === 1 && entry.TWAY_ID2 !== "") roadName = entry.TWAY_ID2;
                    else break;
                //in wordsToFix, add a word from the crash database road names that needs to be changed followed by what it should be changed to. So even indices should be words to remove and odd indices should be their replacements.
                //Would like to shorten TRAIL to TRL but there are too many issues with it, such as "Chisholm Trail Rd".
                //Keep the last two indices as " " and "" to omit any spaces after fixing all this stuff. Omitting spaces should make it more likely to properly detect road matches.
                var wordsToFix = ["AVENUE", "AVE", "STREET", "ST", "DRIVE", "DR", "ROAD", "RD", "PARKWAY", "PKWY", "FREEWAY", "FRWY", "HIGHWAY", "HWY", "LANE", "LN",
                "PGBT", "PRESIDENT GEORGE BUSH TURNPIKE", "PGB TURNPIKE", "PRESIDENT GEORGE BUSH TURNPIKE", " ", ""];
                //For each word that needs to be fixed, if that word is in the original road name, split the name by using the word to fix as a delimiter.
                //Concatenate the two (or more) split parts of the original road name with the new word name between them. This replaces the original word with the new word.
                for(var k = 0; k < wordsToFix.length; k += 2) {
                  if(roadName.search(wordsToFix[k]) !== -1) {
                    let nameToFix = roadName.split(wordsToFix[k]);
                    roadName = nameToFix[0];
                    for (var j = 1; j < nameToFix.length; j++)
                    roadName = roadName + wordsToFix[k + 1] + nameToFix[j];
                  }
                }
                initialCrashList.push({
                  roadName: roadName,
                  vehicleNum: parseInt(entry.TOTALVEHICLES),
                  fatals: parseInt(entry.FATALS),
                });
              }
              if(initialCrashList.length >= 779) setCrashList(initialCrashList);
            });
          })
          .catch((error) => {
            console.error(error);
          });
        });
      }
      //In the foreach loop below, get all the roads in the routes from Google Directions API's results (routeData) and compare them to the crash API roads.
      //Found any matches? Increment that route's fatality, accident, and crashed car count.
      routeData.routes.forEach(function(entry, index) {
        var dead = 0;
        var crashedCars = 0;
        var accidents = 0;
        var roadList = []; //becomes populated with all the road names in each route.
        entry.legs.forEach(function(entry, index) {
          entry.steps.forEach(function(entry, index) {
            let instructions = entry.html_instructions;
            let indexOfBTag = instructions.search("<b>");//Road names are always within <b></b> tags.
            while(indexOfBTag !== -1) {
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
              if(boldedString.search(" ") != -1  && roadList.indexOf(boldedString) === -1) {
                boldedString = boldedString.toUpperCase(); //every road name in the crash api is upper case. So make these names match that.

                //Highway names are a mess in the crash API. Just find the highway name (letter(s) followed by a dash followed by number(s)) and compare that.
                var isDash = boldedString.search("-"); //Is there a dash in the road name from Google Directions API?
                var highwayNameStart = 0;
                var highwayNameEnd = boldedString.length;
                if(isDash !== -1){
                  for(var l = isDash - 1; l >= 0; l--){
                    let startCut = boldedString.substring(l, l + 1);
                    if(startCut === " ") {
                      highwayNameStart = l + 1;
                      break;
                    }
                  }
                  for(var l = isDash + 1; l < boldedString.length; l++){
                    let endCut = boldedString.substring(l, l + 1);
                    if(endCut === " ") {
                      highwayNameEnd = l;
                      break;
                    }
                  }
                }
                var highwayName = boldedString.substring(highwayNameStart,highwayNameEnd);
                //Remove spaces. Also did this above with the crash data road names. Should make it more likely to successfully match roads.
                if(boldedString.search(" ") !== -1) {
                  let spacesCutOut = boldedString.split(" ");
                  boldedString = spacesCutOut[0];
                  for (var j = 1; j < spacesCutOut.length; j++)
                  boldedString = boldedString + spacesCutOut[j];
                }
                if(typeof crashList !== "undefined")
                  crashList.forEach(function(entry, index) {
                    //console.log("NHTSA name: " + entry.roadName + " Google name: " + boldedString + " Highway: " + highwayName);
                    if(entry.roadName.search(boldedString) !== -1) {
                      dead += entry.fatals;
                      crashedCars += entry.vehicleNum;
                      accidents++;
                      console.log("Match found for " + entry.roadName);
                    }
                    else if((isDash !== -1) && (entry.roadName.search(highwayName) !== -1)){
                      dead += entry.fatals;
                      crashedCars += entry.vehicleNum;
                      accidents++;
                      console.log("Highway match found for " + entry.roadName);
                    }
                  });
                roadList.push(boldedString);
              }
              indexOfBTag = instructions.search("<b>");
            }
        });});
        var safetyScore = dead + (crashedCars / 2);
        var ratingLetter = '?';
        if(typeof crashList !== "undefined") {
          if(safetyScore > 240) ratingLetter = 'F';
          else if (safetyScore > 220) ratingLetter = 'D-';
          else if (safetyScore > 200) ratingLetter = 'D';
          else if (safetyScore > 180) ratingLetter = 'D+';
          else if (safetyScore > 160) ratingLetter = 'C-';
          else if (safetyScore > 140) ratingLetter = 'C';
          else if (safetyScore > 120) ratingLetter = 'C+';
          else if (safetyScore > 100) ratingLetter = 'B-';
          else if (safetyScore > 80) ratingLetter = 'B';
          else if (safetyScore > 60) ratingLetter = 'B+';
          else if (safetyScore > 40) ratingLetter = 'A-';
          else if (safetyScore > 20) ratingLetter = 'A';
          else ratingLetter = 'A+';
        }
        routesDisplay[index] =
          <RouteOption
            summary = {entry.summary}
            distance = {entry.legs[0].distance.text}
            duration = {entry.legs[0].duration.text}
            ratingLetter = {ratingLetter} //This will be set to our calculated safety rating
            key = {index}
          >
            <View style = {{height: 80, justifyContent: 'flex-end'}}>
              <Text style = {styles.safetyFacts}>{crashedCars} vehicles involved in an accident along this route in 2018</Text>
              <Text style = {styles.safetyFacts}>{dead} fatalities along this route in 2018</Text>
              <TouchableOpacity
                onPress={() => {navigation.navigate('Map', {newRouteInfo: routeData.routes[index]});}}
                style = {styles.selectRouteButton}>
                <Text style = {styles.selectRouteButtonText}>Select Route</Text>
              </TouchableOpacity>
            </View>
          </RouteOption>
      });
    }
  }
  return (
    <View style={{ flex: 1, flexDirection: 'column', backgroundColor: '#ffffff'}}>
    <Text style={{ fontFamily: 'Varela-Regular',  fontSize: 20 }}> Create Route </Text>
      <View style={{ flex: 3, backgroundColor: '#f7dfe6', padding: 3}}>
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
      <View style={{ flex: 3, backgroundColor: '#ff2063', padding: 3}}>
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
      <View style = {{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
        <Switch
          trackColor={{ false: "#767577", true: "#f7dfe6" }}
          thumbColor={switchEnabled ? "#ff2063" : "#bababa"}
          onValueChange={toggleSwitch}
          value={switchEnabled}
        />
        <Text style = {{fontFamily: 'Varela-Regular', fontSize: 15}}>Avoid highways</Text>
      </View>
      <View style={{ flex: 9 }}>
        <Text style={{ fontFamily: 'Varela-Regular', fontSize: 18 }}> Recommended Routes </Text>
        <ScrollView style={{ paddingTop: 3}}>
          {routesDisplay}
        </ScrollView>
        <View style = {{width: '100%', height: '100%', backgroundColor: '#ffffff', flex: 1, alignSelf: 'stretch'}}/>
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



//Styles can be declared here instead of inline so that they are easier to maintain..
const styles = StyleSheet.create({
  latLongReadout: {
    color: '#777777',
    fontSize: 10,
    marginLeft: 'auto',
    alignSelf: 'center'
  },
  navigator: {
    position: "absolute",
    height: 110,
    opacity: .95,
    borderRadius: 2,
    backgroundColor: "white",
    flexDirection: 'row',
    width: width,
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
  selectRouteButtonText: {
    fontSize: 16,
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
  },
  selectRouteButton: {
    bottom: 5,
    backgroundColor: "#ff2063",
    borderRadius: 20,
    height: 30,
    width: 140,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  },
  safetyFacts: {
    fontFamily: 'Varela-Regular',
    fontSize: 12,
    bottom: 7,
    color: '#262626'
  },
  stepArrows: {
    width: 40,
    height: 40
  }
});
