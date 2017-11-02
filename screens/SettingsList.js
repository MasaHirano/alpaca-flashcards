import React from 'react';
import { FlatList, StyleSheet, Text, View, TouchableHighlight, AsyncStorage } from 'react-native';
import { GoogleSignin } from 'react-native-google-signin';

import Config from '../app/config';

const _ = require('lodash');

export default class SettingsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        { key: 'sheetId', name: 'Sheet ID' },
        { key: 'sheetTitle', name: 'Sheet Title' },
      ],
      spreadsheet: {
        id: null,
        name: null,
        title: null,
        lastSyncedAt: null,
      },
    };
  }

  componentDidMount() {
    GoogleSignin.configure(Config.googleSignin).then(() => {
      GoogleSignin.currentUserAsync().then((user) => {
        this.setState({ user });
        AsyncStorage.multiGet(['GoogleSpreadsheet.id', 'GoogleSpreadsheet.name', 'GoogleSpreadsheet.title'], (err, stores) => {
          const sheetInfo = _.fromPairs(stores);
          this.setState({
            spreadsheet: {
              id: sheetInfo['GoogleSpreadsheet.id'],
              name: sheetInfo['GoogleSpreadsheet.name'],
              title: sheetInfo['GoogleSpreadsheet.title'],
              lastSyncedAt: sheetInfo['GoogleSpreadsheet.lastSyncedAt'],
            }
          });
        });
      }).done();
    });
  }

  _onPress({ item, index }) {
    this.props.navigation.navigate('SettingsListChild', {
      type: item.key,
      onSelect: (data) => {
        console.log('onSelect has runned', data);
        this.setState(data);
      },
      spreadsheet: this.state.spreadsheet,
    });
  }

  render() {
    return (
      <View style={styles.container} >
        <FlatList
          data={this.state.data}
          renderItem={this._renderItem.bind(this)}
          keyExtractor={(item, index) => item.key}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>
    );
  }

  _renderItem({ item, index }) {
    const { navigation } = this.props;
    if (item.key === 'sheetId') {
      var selectedItem = this.state.spreadsheet.name;
    } else if (item.key === 'sheetTitle') {
      var selectedItem = this.state.spreadsheet.title;
    }
    return (
      <TouchableHighlight
        underlayColor='rgba(192,192,192,1)'
        onPress={() => this._onPress({ item, index })} >
        <View style={styles.phraseView} >
          <Text>
            {item.name}: {selectedItem}
          </Text>
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    marginTop: 10,
  },
  separator: {
    height: 1,
    backgroundColor: "#CED0CE",
  },
  phraseView: {
    padding: 10,
    height: 48,
  },
});
