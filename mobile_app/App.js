import React from 'react';
import { StyleSheet, FlatList, View } from 'react-native';
import BirdItem from './Components/BirdItem'
import birds from './Helpers/birdData'

export default class App extends React.Component {
  render() {
      return (
          <View style={styles.container}>
              <FlatList
                  data={birds}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({item}) => <BirdItem bird={item}/>}
              />
          </View>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop:20,
    flex: 1,
    backgroundColor: '#fff'
  },
});
