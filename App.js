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

const Realm = require('realm');
const _ = require('lodash');

class Phrase {
  get key() {
    return this.sentence;
  }

  isDone() {
    return this.status == 1;
  }
};

Phrase.schema = {
  name: 'Phrase',
  primaryKey: 'id',
  properties: {
    id:       'int',
    sentence: 'string',
    status:   { type: 'int', default: 0 },          // 0: undone, 1: done, 2: archived
    tags:     { type: 'list', objectType: 'Tag' },
  }
};
class Tag {};
Tag.schema = {
  name: 'Tag',
  primaryKey: 'id',
  properties: {
    id:      'int',
    name:    'string',
    phrases: { type: 'linkingObjects', objectType: 'Phrase', property: 'tags' },
  }
};

const realm = new Realm({ schema: [Phrase, Tag] });

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    var phrases = realm.objects('Phrase').sorted('status').slice();
    this.state = {
      _data: phrases,
    };
    // realm.write(() => {
    //   const phrase = realm.create('Phrase', {
    //     id: 3,
    //     sentence: "bar",
    //     tags: realm.objects('Tag'),
    //   });
    // });
    // realm.write(() => {
    //   const tag = realm.create('Tag', {
    //     id: 1,
    //     name: 'BigBangTheory',
    //   });
    // });
    // realm.write(() => {
    //   const tag = realm.create('Tag', {
    //     id: 2,
    //     name: 'BigBangTheory_S05E01',
    //   });
    // });
  }

  static navigationOptions = {
    title: "Today's English phrases"
  };

  deletePhrase(item, index) {
    var newItem = _.clone(this.state._data);
    newItem.splice(index, 1);
    realm.write(() => {
      item.status = (item.status == 0) ? 1 : 0;
    });
    newItem.push(item);
    this.setState({
      _data: newItem,
    });
  }

  renderItem({ item, index }) {
    const swipeBtns = [{
      text: 'Delete',
      backgroundColor: 'red',
      underlayColor: 'rgba(0,0,0,1)',
      onPress: () => { this.deletePhrase(item, index) }
    }];

    const itemStyle = (item.status == 0) ? styles.item : styles.doneItem;

    return (
      <Swipeout right={swipeBtns}
        autoClose={true}
        backgroundColor='transparent'>
        <TouchableHighlight
          underlayColor='rgba(192,192,192,1)'
          onPress={() => {}} >
          <Text style={[styles.item, item.isDone() && styles.doneItem]}>
            {item.key}
          </Text>
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
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  doneItem: {
    backgroundColor: 'lightgray',
  },
})
