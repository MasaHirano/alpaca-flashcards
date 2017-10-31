/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import { StackNavigator, DrawerNavigator } from 'react-navigation';
import { SideMenu, List, ListItem } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome';

import Phrases from './screens/Phrases';
import Signin from './screens/Signin';
import SettingsList from './screens/SettingsList';
import SettingsListChild from './screens/SettingsListChild';

const Drawer = DrawerNavigator({
  Phrases: {
    screen: Phrases
  },
  Signin: {
    screen: Signin
  },
});
Drawer.navigationOptions = ({ navigation }) => {
  return {
    headerLeft: (
      <Icon.Button
        name='align-justify'
        color='blue'
        backgroundColor='transparent'
        onPress={() => navigation.navigate('DrawerToggle')}
      />
    ),
  }
};

const SimpleApp = StackNavigator({
  Drawer: {
    screen: Drawer,
  },
  SettingsList: {
    screen: SettingsList,
  },
  SettingsListChild: {
    screen: SettingsListChild,
  },
});

export default class App extends React.Component {
  render() {
    return <SimpleApp />;
  }
}
