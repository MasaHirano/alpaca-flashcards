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
import Config from '../app/config';

import SettingsList from './SettingsList';

const _ = require('lodash');

export default class Signin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sheets: [],
      innerSheets: [],
      user: {},
      sheetId: null,
      sheetTitle: null,
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

  componentWillUnmount() {
    // Save sheetId and sheetTitle to local storage.
    // const { sheetId, sheetTitle } = this.state;
    // const keyValuePairs = [
    //   ['GoogleSpreadsheet.id', sheetId],
    //   ['GoogleSpreadsheet.title', sheetTitle],
    // ];
    // console.log('Signin#componentWillUnmount', keyValuePairs);
    // AsyncStorage.multiSet(keyValuePairs, (errors) => {
    //   if (! _.isEmpty(errors)) {
    //     console.error('Signin#componentWillUnmount', errors);
    //   }
    // });
  }

  render() {
    return (
      <View style={styles.navBar}>
        <View style={{ marginTop: 10 }}>
          <GoogleSigninButton
            style={{ width: 312, height: 48 }}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={this._signIn.bind(this)} />
        </View>

        <View>
          <SettingsList
            navigation={this.props.navigation}
          >
          </SettingsList>
        </View>
      </View>
    );
  }

  _signIn() {
    GoogleSignin.signIn()
    .then((user) => {
      console.log('Signin#_signIn', user);
      this.setState({ user });

      // fetch("https://www.googleapis.com/drive/v3/files?q=mimeType%3D'application%2Fvnd.google-apps.spreadsheet'", {
      //   headers: { 'Authorization': `Bearer ${user.accessToken}` },
      // })
      // .then((response) => {
      //   response.json().then((data) => {
      //     console.log('Signin#_signIn', data);
      //     this.setState({ sheets: data.files });
      //     if (_.isEmpty(this.state.sheetId)) {
      //       this.setState({
      //         sheetId: _.first(data.files).id,
      //         sheetTitle: null,
      //       });
      //       this._describeSheet(sheetId);
      //     }
      //   });
      // });
    })
    .catch((err) => {
      console.error('WRONG SIGNIN', err);
    })
    .done();
  }

  // _describeSheet(sheetId) {
  //   fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}?includeGridData=false`, {
  //     headers: { 'Authorization': `Bearer ${this.state.user.accessToken}` },
  //   })
  //   .then((response) => {
  //     response.json().then((data) => {
  //       console.log('Signin#_describeSheet', data);
  //       this.setState({
  //         innerSheets: data.sheets,
  //         sheetTitle: _.first(data.sheets).properties.title,
  //       });
  //     });
  //   });
  // }
}

const styles = StyleSheet.create({
  navBar: {
    // flexDirection: 'column',
    flex: 1,
    // justifyContent: 'space-between',
    // alignItems: 'center',
  },
})