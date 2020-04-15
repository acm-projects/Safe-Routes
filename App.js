import React, { Component } from 'react';
import { ActivityIndicator, FlatList, Text, View, StyleSheet } from 'react-native';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      isLoading: true,
      dataSource: null,
    };
  }

  componentDidMount() {
    fetch('http://www.mapquestapi.com/traffic/v2/incidents?key=KEY&boundingBox=33.0469,-96.576,32.8746,-96.89117&filters=construction,incidents,congestion')
      .then((response) => response.json())
      .then((json) => {
        this.setState({ data: json.incidents });
      })
      .catch((error) => console.error(error))
      .finally(() => {
        this.setState({ isLoading: false });
      });
  }

  render() {
    const { data, isLoading } = this.state;
    var text = "Royal ln";
    return (
      <View style={{ flex: 1, padding: 24 }}>
        {isLoading ? <ActivityIndicator/> : (
          <FlatList
            data={data}
            keyExtractor={({ id }, index) => id}
            renderItem={({ item }) => (

              <Text>{item.shortDesc},{item.lng},{item.lat} {item.severity}</Text>

            )}
          />
        )}
      </View>
    );
  }


};
