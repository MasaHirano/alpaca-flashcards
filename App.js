/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import { FlatList, StyleSheet, Text, View, TouchableHighlight, VirtualizedList } from 'react-native';
import Swipeout from 'react-native-swipeout';
import { StackNavigator } from 'react-navigation';
import { ListView } from 'realm/react-native';

import Phrase from './app/models/Phrase';
import Tag from './app/models/Tag';
import Importer from './app/Importer';

const Realm = require('realm');
const _ = require('lodash');

const realm = new Realm({ schema: [Phrase, Tag] });

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    const phrases = realm.objects('Phrase').sorted('status').slice(0, 10);
    this.state = {
      _data: phrases,
    };
  }

  static navigationOptions = {
    title: "Today's English phrases"
  };

  deletePhrase(item, index) {
    const newItem = _.clone(this.state._data);
    newItem.splice(index, 1);
    realm.write(() => {
      item.status = (item.isDone() ^ true); // toggle status
    });
    newItem.push(item);
    this.setState({
      _data: newItem,
    });
  }

  renderTags(item) {
    var tags = item.tags.map((t, i) => {
      return (
        <View style={styles.tagInnerView} key={i}>
          <Text style={styles.tagText} key={i} >
            {t.name}
          </Text>
        </View>
      );
    });
    return (
      <View style={[styles.tagView]}>
        {tags}
      </View>
    );
  }

  renderItem({ item, index }) {
    const swipeBtns = [{
      text: 'Delete',
      backgroundColor: 'red',
      underlayColor: 'rgba(0,0,0,1)',
      onPress: () => { this.deletePhrase(item, index) }
    }];

    return (
      <Swipeout
        right={swipeBtns}
        autoClose={true}
        backgroundColor='transparent'>
        <TouchableHighlight
          underlayColor='rgba(192,192,192,1)'
          onPress={() => {}} >
          <View style={styles.item}>
            <Text
              style={{ fontSize: 18, marginBottom: 2 }}
              ellipsizeMode='tail'
              numberOfLines={1} >
              {item.key}
            </Text>
            {this.renderTags(item)}
          </View>
        </TouchableHighlight>
      </Swipeout>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state._data}
          renderItem={this.renderItem.bind(this)}
          keyExtractor={(item) => item.key}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>
    );
  }
}

const SimpleApp = StackNavigator({
  Home: { screen: HomeScreen }
});

export default class App extends React.Component {
  render() {
    return <SimpleApp />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
    backgroundColor: '#fff',
    justifyContent: 'center'
  },
  separator: {
    height: 1,
    width: "86%",
    backgroundColor: "#CED0CE",
  },
  item: {
    padding: 10,
    height: 60,
  },
  doneItem: {
    backgroundColor: 'lightgray',
  },
  tagView: {
    flexDirection:'row',
    flexWrap:'wrap',
  },
  tagInnerView: {
    backgroundColor: 'royalblue',
    borderRadius: 10,
    marginRight: 5,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  tagText: {
    color: 'white',
    fontSize: 11,
  },
})
