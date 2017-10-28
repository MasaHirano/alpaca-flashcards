/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import { StackNavigator } from 'react-navigation';

import Phrases from './screens/Phrases';
import Signin from './screens/Signin';

const SimpleApp = StackNavigator({
  Phrases: { screen: Phrases },
  Signin: { screen: Signin },
});

export default class App extends React.Component {
  render() {
    return <SimpleApp />;
  }
}
