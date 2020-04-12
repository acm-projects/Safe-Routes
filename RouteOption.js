import React,{Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Animated
} from 'react-native';

class RouteOption extends Component {
    constructor(props) {
        super(props);

        this.state = {
            expanded: false,
            animation: new Animated.Value(65)
        };
    }

    toggle(){
      const minHeight = 65;
      const maxHeight = 140;

      let initialValue = this.state.expanded ? maxHeight : minHeight,
          finalValue = this.state.expanded ? minHeight : maxHeight;

      this.setState({
          expanded : !this.state.expanded
      });

      this.state.animation.setValue(initialValue);

      Animated.spring(
          this.state.animation,
          {
              toValue: finalValue
          }
      ).start();
    }


    render(){
      let contentThatIsShownWhenExpanded = <View/>;
      if(this.state.expanded) contentThatIsShownWhenExpanded = this.props.children;
      var letterColor = 'black';
      switch(this.props.ratingLetter){
        case "A+": letterColor = '#003800';
          break;
        case "A": letterColor = '#006000';
          break;
        case "A-": letterColor = '#467200';
          break;
        case "B+": letterColor = '#696d00';
          break;
        case "B": letterColor = '#8c9100';
          break;
        case "B-": letterColor = '#ba8c01';
          break;
        case "C+": letterColor = '#ba7001';
          break;
        case "C": letterColor = 'orange';
          break;
        case "C-": letterColor = '#fc5102';
          break;
        case "D+": letterColor = '#f23000';
          break;
        case "D": letterColor = 'red';
          break;
        case "D-": letterColor = '#ba0000';
          break;
        case "F": letterColor = 'maroon';
          break;
      }
        return (
            <Animated.View style = {{height: this.state.animation, borderBottomWidth: 3, borderBottomColor: 'white', backgroundColor: '#f7dfe6'}}>
              <TouchableOpacity style = {{padding: 5}} onPress={this.toggle.bind(this)}>
                <View style = {{flexDirection: 'row'}}>
                  <View style = {{flex: 8}}>
                    <Text style={{ fontSize: 14, fontFamily: 'Varela-Regular'}} numberOfLines = {1}>{this.props.summary}</Text>
                    <Text style={{ fontSize: 12, fontFamily: 'Varela-Regular'}}>{this.props.distance}</Text>
                    <Text style={{ fontSize: 12, fontFamily: 'Varela-Regular'}}>{this.props.duration}</Text>
                  </View>
                  <View style = {{flex: 2, justifyContent:'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 30, fontFamily: 'Varela-Regular', color: letterColor}}>{this.props.ratingLetter}</Text>
                  </View>
                </View>
                <View>
                  {contentThatIsShownWhenExpanded}
                </View>
              </TouchableOpacity>
            </Animated.View>
        );
    }
}
export default RouteOption;

const styles = StyleSheet.create({

});
