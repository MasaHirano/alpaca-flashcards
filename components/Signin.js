/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import { StyleSheet, View, Text, AsyncStorage, TouchableOpacity } from 'react-native';
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';
import _ from 'lodash';

import Config from '../app/config';

import SettingsList from './SettingsList';

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
  }

  get _loggedInMessage() {
    console.log('_loggedInMessage', this.props);
    const { user } = this.props.signin;
    if (! _.isEmpty(user)) {
      return `Signed in as ${user.email}`;
    } else {
      return 'Not sign in yet';
    }
  }

  render() {
    return (
      <View style={styles.navBar} >
        <View style={{ marginTop: 10 }} >
          <GoogleSigninButton
            style={{ width: 312, height: 48 }}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
          />
          <Text style={{ color: 'dimgray', paddingLeft: 5 }} >
            {this._loggedInMessage}
          </Text>
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
});