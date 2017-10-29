/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import { StyleSheet, View, Text, Picker, AsyncStorage } from 'react-native';
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';

import Importer from '../app/Importer';
import realm from '../app/db/realm';

const _ = require('lodash');

class Signin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sheets: [],
      sheetId: null,
      innerSheets: [],
      sheetTab: null,
    };
  }

  componentDidMount() {
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
      iosClientId: '211779780353-kv9bthgjhqkqdd9e5sfd12e7sali0d95.apps.googleusercontent.com', // only for iOS
    })
    .then(() => {
      GoogleSignin.currentUserAsync().then((user) => {
        this.setState(user);
      }).done();
    });
  }

  componentWillUnmount() {
    const keyValuePairs = [
      ['GoogleSpreadsheet.id', this.state.sheetId],
      ['GoogleSpreadsheet.title', this.state.sheetTab],
    ];
    console.log(keyValuePairs);
    AsyncStorage.multiSet(keyValuePairs, (errors) => {
      console.log('Error at Signin#componentWillUnmount', errors);
    });
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

        <View>
          <Text>Select Sheet</Text>
          <Picker
            style={{ width: 100 }}
            selectedValue={this.state.sheetId}
            onValueChange={(itemValue, itemIndex) => {
              this.setState({ sheetId: itemValue });
              this._describeSheet(itemValue);
            }}
          >
            {
              this.state.sheets.map((sheet, index) => {
                return <Picker.Item key={index} label={sheet.name} value={sheet.id} />
              })
            }
          </Picker>
        </View>

        <View>
          <Text>Select Sheet Tab</Text>
          <Picker
            style={{ width: 100 }}
            selectedValue={this.state.sheetId}
            onValueChange={(itemValue, itemIndex) => this.setState({ sheetTab: itemValue })}
          >
            {
              this.state.innerSheets.map((sheet, index) => {
                return <Picker.Item key={index} label={sheet.properties.title} value={sheet.properties.title} />
              })
            }
          </Picker>
        </View>
      </View>
    );
  }

  _signIn() {
    GoogleSignin.signIn()
    .then((user) => {
      console.log(user);
      this.setState({ user });
      var endpoint = 'https://sheets.googleapis.com/v4/spreadsheets';
      var sheetId = '15NvtH2b6UmzsH2WF0dh9ema8lPX7_E6XMVlecCtKbaE';

      fetch(`${endpoint}/${sheetId}/values/Sheet1!A2:Y999`, {
        headers: { 'Authorization': `Bearer ${user.accessToken}` },
      })
      .then((response) => {
        response.json().then((data) => {
          // console.log(data);
          // const importer = new Importer();
          // importer.import(data.values);
        });
      });

      fetch("https://www.googleapis.com/drive/v3/files?q=mimeType%3D'application%2Fvnd.google-apps.spreadsheet'", {
        headers: { 'Authorization': `Bearer ${user.accessToken}` },
      })
      .then((response) => {
        response.json().then((data) => {
          console.log(data);
          this.setState({ sheets: data.files });
          if (_.isEmpty(this.state.sheetId)) {
            this.setState({ sheetId: _.first(data.files).id });
          }
        });
      });
    })
    .catch((err) => {
      console.log('WRONG SIGNIN', err);
    })
    .done();
  }

  _describeSheet(sheetId) {
    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}?includeGridData=false`, {
      headers: {
        'Authorization': `Bearer ${this.state.user.accessToken}`,
      },
    })
    .then((response) => {
      response.json().then((data) => {
        console.log(data);
        this.setState({ innerSheets: data.sheets });
        if (_.isEmpty(this.state.sheetTab)) {
          this.setState({ sheetTab: _.first(data.sheets).properties.title });
        }
      });
    });
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