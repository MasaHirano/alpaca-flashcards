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
// import Importer from './app/Importer';

const Realm = require('realm');
const _ = require('lodash');

const realm = new Realm({ schema: [Phrase, Tag], schemaVersion: 1 });

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    // const importer = new Importer();
    // importer.import();
    const phrases = realm.objects('Phrase').sorted('status').slice(0, 10);
    this.state = {
      _data: phrases,
    };
  }

  static navigationOptions = {
    title: "Today's English phrases"
  };

  completePhrase(item, index) {
    const newItem = _.clone(this.state._data);
    newItem.splice(index, 1);
    realm.write(() => {
      item.status = (item.isDone() ^ true); // toggle status
      item.updatedAt = new Date();
    });
    newItem.push(item);
    this.setState({
      _data: newItem,
    });
  }

  renderTags(item) {
    return (
      <View style={styles.tagView}>
        {
          item.tags.map((tag, index) => {
            return (
              <View style={styles.tagInnerView} key={index}>
                <Text style={styles.tagText}>
                  #{tag.name}
                </Text>
              </View>
            );
          })
        }
      </View>
    );
  }

  renderItem({ item, index }) {
    const swipeBtns = [{
      text: 'Complete',
      backgroundColor: 'blue',
      underlayColor: 'rgba(0,0,0,1)',
      onPress: () => { this.completePhrase(item, index) }
    }];

    return (
      <Swipeout
        right={swipeBtns}
        autoClose={true}
        backgroundColor='transparent'>
        <TouchableHighlight
          underlayColor='rgba(192,192,192,1)'
          onPress={() => {}} >
          <View style={[styles.phraseView, item.isDone() && styles.phraseDoneView]}>
            <Text
              style={styles.phraseText}
              ellipsizeMode='tail'
              numberOfLines={1} >
              {item.key}
            </Text>
            {this.renderTags(item)}
            <Text style={styles.phraseCreatedAtText}>
              {item.createdAt.toLocaleString('en-US')}
            </Text>
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
    backgroundColor: "#CED0CE",
  },
  phraseView: {
    padding: 10,
    height: 72,
  },
  phraseDoneView: {
    backgroundColor: 'lightgray',
  },
  phraseText: {
    fontSize: 18,
    marginBottom: 2,
  },
  phraseCreatedAtText: {
    color: 'dimgray',
    fontSize: 9,
  },
  tagView: {
    flexDirection:'row',
    flexWrap:'nowrap',
  },
  tagInnerView: {
    // backgroundColor: 'lightskyblue',
    // borderRadius: 10,
    // paddingHorizontal: 5,
    paddingVertical: 2,
    marginRight: 5,
  },
  tagText: {
    color: 'midnightblue',
    fontSize: 11,
  },
})
