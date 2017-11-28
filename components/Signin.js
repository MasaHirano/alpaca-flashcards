/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import { StyleSheet, View, Text, AsyncStorage, TouchableOpacity } from 'react-native';
import { GoogleSigninButton } from 'react-native-google-signin';
import _ from 'lodash';

import SettingsList from '../containers/SettingsList';

export default class Signin extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.navBar} >
        <View style={{ marginTop: 10 }} >
          <GoogleSigninButton
            style={{ width: 312, height: 48 }}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={this.props.onPressSignIn}
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
          onPress={this.props.onPressSignOut} >
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

  get _loggedInMessage() {
    const { user } = this.props.signin;
    if (! _.isEmpty(user)) {
      return `Signed in as ${user.email}`;
    }
    return 'Not sign in yet';
  }
}

const styles = StyleSheet.create({
  navBar: {
    flex: 1,
  },
});