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
        return (
            <Animated.View style = {{height: this.state.animation, borderBottomWidth: 3, borderBottomColor: 'white', backgroundColor: '#f7dfe6'}}>
              <TouchableOpacity style = {{padding: 5}} onPress={this.toggle.bind(this)}>
                <View style = {{flexDirection: 'row'}}>
                  <View style = {{flex: 8}}>
                    <Text style={{ fontSize: 14, fontFamily: 'Varela-Regular'}}>{this.props.summary}</Text>
                    <Text style={{ fontSize: 12, fontFamily: 'Varela-Regular'}}>{this.props.distance}</Text>
                    <Text style={{ fontSize: 12, fontFamily: 'Varela-Regular'}}>{this.props.duration}</Text>
                  </View>
                  <View style = {{flex: 2, justifyContent:'center', alignItems: 'center'}}>
                    <Text style={styles.ratingLetter}>{this.props.ratingLetter}</Text>
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
  ratingLetter: {
    fontSize: 30,
    color: 'maroon'
  },
});
