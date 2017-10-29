/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';
import { StyleSheet, View, Text } from 'react-native';

import Importer from '../app/Importer';

const _ = require('lodash');

class Signin extends React.Component {
  constructor(props) {
    super(props);

    GoogleSignin.hasPlayServices({ autoResolve: true })
    .then(() => {
    })
    .catch((err) => {
      console.log("Play services error", err.code, err.message);
    });

    GoogleSignin.configure({
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive.readonly',
      ],
      iosClientId: '208998088995-o9ki8qrtvjs3ac6cu4vaj3mefka8bhej.apps.googleusercontent.com', // only for iOS
    })
    .then(() => {
    });
  }

  _signIn() {
    GoogleSignin.signIn()
    .then((user) => {
      console.log(user);
      this.setState({ user });
      var endpoint = 'https://sheets.googleapis.com/v4/spreadsheets';
      var sheetId = '15NvtH2b6UmzsH2WF0dh9ema8lPX7_E6XMVlecCtKbaE';

      fetch(`${endpoint}/${sheetId}/values/Sheet1!A2:Y999`, {
        headers: {
          'Authorization': `Bearer ${user.accessToken}`,
        },
      })
      .then((response) => {
        response.json().then((data) => {
          console.log(data);
          // const importer = new Importer();
          // importer.import(data.values);
        });
      });

      fetch("https://www.googleapis.com/drive/v3/files?q=mimeType%3D'application%2Fvnd.google-apps.spreadsheet'", {
        headers: {
          'Authorization': `Bearer ${user.accessToken}`,
        },
      })
      .then((response) => {
        response.json().then((data) => {
          console.log(data);
          // const importer = new Importer();
          // importer.import(data.values);
        });
      });
    })
    .catch((err) => {
      console.log('WRONG SIGNIN', err);
    })
    .done();
  }

  render() {
    return (
      <View style={styles.navBar}>
        <View style={{ marginTop: 10 }}>
          <GoogleSigninButton
            style={{ width: 230, height: 48 }}
            size={GoogleSigninButton.Size.Standard}
            color={GoogleSigninButton.Color.Dark}
            onPress={this._signIn.bind(this)} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
})

export default Signin;