/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import { StyleSheet, View, Text, AsyncStorage, TouchableOpacity } from 'react-native';
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';

import Config from '../app/config';

import SettingsList from './SettingsList';

const _ = require('lodash');

export default class Signin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sheets: [],        // List of spreadsheets
      innerSheets: [],   // List of titles in a spreadsheet
      user: {},          // Google user objects
      sheetId: null,     // Active sheeetId
      sheetTitle: null,  // Active sheetTitle
    };
  }

  componentDidMount() {
    GoogleSignin.hasPlayServices({ autoResolve: true }).then(() => {
      // play services are available. can now configure library
    })
    .catch((err) => {
      console.error("Play services error", err.code, err.message);
    });

    GoogleSignin.configure(Config.googleSignin).then(() => {
      GoogleSignin.currentUserAsync().then((user) => {
        this.setState(user);
      }).done();
    });

    AsyncStorage.multiGet(['GoogleSpreadsheet.id', 'GoogleSpreadsheet.title'], (err, stores) => {
      const sheetInfo = _.fromPairs(stores);
      this.setState({
        sheetId: sheetInfo['GoogleSpreadsheet.id'],
        sheetTitle: sheetInfo['GoogleSpreadsheet.title'],
      });
      console.log(this.state)
    });
  }

  render() {
    return (
      <View style={styles.navBar} >
        <View style={{ marginTop: 10 }} >
          <GoogleSigninButton
            style={{ width: 312, height: 48 }}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={this._signIn.bind(this)}
          />
        </View>

        <View>
          <SettingsList
            navigation={this.props.navigation}
          />
        </View>

        <TouchableOpacity
          onPress={this._signOut.bind(this)} >
          <View
            style={{ marginTop: 10, display: 'flex', flexDirection: 'row', alignItems: 'center' }}
            onPress={() => { console.log('signOut was tapped') }} >
            <GoogleSigninButton
              style={{ width: 48, height: 48 }}
              size={GoogleSigninButton.Size.Wide}
              color={GoogleSigninButton.Color.Dark}
            />
            <View style={{ height: 41, backgroundColor: 'lightcoral', justifyContent: 'center', width: 265, marginLeft: -5, paddingLeft: 10 }} >
              <Text style={{ color: 'white', fontWeight: 'bold' }} >Sign out from Google</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  _signIn() {
    GoogleSignin.signIn()
    .then((user) => {
      console.log('Signin#_signIn', user);
      this.setState({ user });
    })
    .catch((err) => {
      console.error('WRONG SIGNIN', err);
    })
    .done();
  }

  _signOut() {
    GoogleSignin.signOut()
    .then(() => {
      var keyValuePairs = [
        ['GoogleSpreadsheet.id', ''],
        ['GoogleSpreadsheet.name', ''],
        ['GoogleSpreadsheet.title', ''],
      ];
      AsyncStorage.multiSet(keyValuePairs, (errors) => {
        if (! _.isEmpty(errors)) {
          console.error('Signin#_signOut', errors);
        }
      });
      this.setState({ sheetId: null, sheetTitle: null });
    })
    .catch((err) => {
      console.error('Signin#_signOut', err);
    });
  }
}

const styles = StyleSheet.create({
  navBar: {
    flex: 1,
  },
})