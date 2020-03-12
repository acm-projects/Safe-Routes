import React, { Component } from "react";
import { StyleSheet, Text, View, TextInput, Button, Image,KeyboardAvoidingView,
  TouchableOpacity, } from "react-native";
  import { NavigationContainer } from '@react-navigation/native';



class HomePage extends Component {
  state = {
       textChange: '',

    }

 _handleTextChange = (text) => {
 this.setState({ textChange: text });
 }
 render() {
 return (


 <View style={styles.container}>
 <TextInput style = {styles.input}
               underlineColorAndroid = "transparent"
               placeholder = "Search here"
               placeholderTextColor = "#D3D3D3"
               autoCapitalize = "none"
               onChangeText = {this.handleEmail}/>
 <Image source={require('/Users/Deesha/Documents/Practice1/dallas.jpg')}
  style={styles.backgroundImage}/>
<View style={[{ width: "100%",height: 30, margin: 0}]}>
  <Button

            color = "#ff2063"
            title="Create Route"
            style = {styles.createRoute}
          />
          <View style={[{ width: 30,height: 30, margin: 0, left: 10, right: 0, bottom:660}]}>
          <Button

                    color = "#ff2063"
                    title="---"
                    style = {styles.createRoute}
                    onPress={() => navigation.navigate('Create Route')}
                  />

</View>
</View>
 </View>
 );
 }
}
function App(){
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
function CreateRouteScreen() {
  return (
    <View style={{ flex: 1, flexDirection: 'column',}}>
      <View style={{ flex: 2, backgroundColor: '#f7dfe6'}} behavior="padding" enabled>
        <Text style={{ fontSize: 18 }}> From </Text>
          <TextInput
            style={{ height: 40 }}
            placeholder = 'Latitude'
            keyboardType = 'numeric'
            onChangeText={text => {}}
          />
          <TextInput
            style={{ height: 40 }}
            placeholder = 'Longitude'
            keyboardType = 'numeric'
            onChangeText={text => {}}
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

const styles = StyleSheet.create({
 container: {
 flex: 1,

 justifyContent: "flex-start",
 alignItems: "center",
 marginBottom: 0,
backgroundColor: "#FF7FA5"
 },
 input: {
      margin: 15,
      height: 40,
      borderColor: '#7a42f4',
      borderWidth: 1,

   },
 backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch'
    marginTop:0,

  },
  createRoute: {
    width: 500,
    height: 100,
    color: 'black'
  },
  button: {

      width: 20,
      height: 20,
      borderColor: 'black',
      borderWidth: 1,
      borderRadius: 5,
      color: 'black',
      fontSize: 24,
      fontWeight: 'bold',
      overflow: 'hidden',
      padding: 12,
      textAlign:'center',
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0


},
 welcome: { },
 input: {
 backgroundColor: "#ffffff",
 fontSize: 20,
 borderWidth: 3,
 padding: 2,
 height: 50,
 width: 300,
 textAlign: "left"

},


});
export default HomePage;
