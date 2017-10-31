import React from 'react';
import { FlatList, StyleSheet, Text, View, TouchableHighlight, Button, TouchableWithoutFeedback, TouchableOpacity, RefreshControl, AsyncStorage } from 'react-native';
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';

import Config from '../app/config';

const _ = require('lodash');

export default class SettingsListChild extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      sheets: [],
      innerSheets: [],
      sheetId: null,
      sheetTitle: null,
      user: {},
      selectedItem: null,
    };

    this._saveSelectedData = this._saveSelectedData.bind(this);
  }

  componentDidMount() {
    GoogleSignin.configure(Config.googleSignin).then(() => {
      GoogleSignin.currentUserAsync().then((user) => {
        this.setState({ user });
        AsyncStorage.multiGet(['GoogleSpreadsheet.id', 'GoogleSpreadsheet.title'], (err, stores) => {
          const sheetInfo = _.fromPairs(stores);
          // this.setState({
          //   sheetId: sheetInfo['GoogleSpreadsheet.id'],
          //   sheetTitle: sheetInfo['GoogleSpreadsheet.title'],
          // });
          if (this.props.navigation.state.params.type == 'sheetId') {
            this.setState({ selectedItem: sheetInfo['GoogleSpreadsheet.id'] });
            this._fetchSheets();
          } else if (this.props.navigation.state.params.type == 'sheetTitle') {
            this.setState({
              sheetId: sheetInfo['GoogleSpreadsheet.id'],
              selectedItem: sheetInfo['GoogleSpreadsheet.title'],
            });
            this._fetchSheetTitles();
          }
        });
      }).done();
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.data}
          renderItem={this._renderItem.bind(this)}
          keyExtractor={(item, index) => index}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>
    );
  }

  _fetchSheets() {
    console.log(this);
    fetch("https://www.googleapis.com/drive/v3/files?q=mimeType%3D'application%2Fvnd.google-apps.spreadsheet'", {
      headers: { 'Authorization': `Bearer ${this.state.user.accessToken}` },
    })
    .then((response) => {
      response.json().then((data) => {
        console.log('SettingsListChild#_fetchSheets', data);
        this.setState({ data: data.files });
        if (_.isEmpty(this.state.sheetTitle)) {
          this.setState({ selectedItem: _.first(data.files).id });
        }
      });
    });
  }

  _fetchSheetTitles() {
    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${this.state.sheetId}?includeGridData=false`, {
      headers: { 'Authorization': `Bearer ${this.state.user.accessToken}` },
    })
    .then((response) => {
      response.json().then((data) => {
        console.log('SettingsListChild#_fetchSheetTitles', data);
        this.setState({ data: data.sheets });
        if (_.isEmpty(this.state.sheetId)) {
          this.setState({ selectedItem: _.first(data.sheets).properties.title });
        }
      });
    });
  }

  _saveSelectedData({ item, index }) {
    if (this.props.navigation.state.params.type == 'sheetId') {
      console.log(item);
      var keyValuePairs = [
        ['GoogleSpreadsheet.id', item.id],
        ['GoogleSpreadsheet.name', item.name],
      ];
    } else if (this.props.navigation.state.params.type == 'sheetTitle') {
      var keyValuePairs = [
        ['GoogleSpreadsheet.title', item.properties.title],
      ];
    }
    // Save sheetId and sheetTitle to local storage.
    AsyncStorage.multiSet(keyValuePairs, (errors) => {
      if (! _.isEmpty(errors)) {
        console.error('Signin#componentWillUnmount', errors);
      }
    });
    this.props.navigation.goBack();
  }

  _renderItem({ item, index }) {
    if (this.props.navigation.state.params.type == 'sheetId') {
      var text = item.name;
    } else if (this.props.navigation.state.params.type == 'sheetTitle') {
      var text = item.properties.title;
    }
    return (
      <TouchableHighlight
        underlayColor='rgba(192,192,192,1)'
        onPress={() => { this._saveSelectedData({ item, index }) }} >
        <View style={styles.phraseView}>
          <Text>
            {text}
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
    // marginTop: 10,
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
