/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import { StackNavigator, DrawerNavigator } from 'react-navigation';
import { SideMenu, List, ListItem } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome';
import { Provider } from 'react-redux';

import configureStore from './store/configureStore'

import Phrases from './containers/Phrases';
import Signin from './components/Signin';
import SettingsList from './components/SettingsList';
import SettingsListChild from './components/SettingsListChild';

// Create Redux store.
const store = configureStore();

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
    return (
      <Provider store={store}>
        <SimpleApp />
      </Provider>
    );
  };
};
