/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import { FlatList, StyleSheet, Text, View, TouchableHighlight, Button, TouchableWithoutFeedback } from 'react-native';
import Swipeout from 'react-native-swipeout';
import { StackNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import Modal from 'react-native-modal';
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';

import realm from './app/db/realm';
import Importer from './app/Importer';

const _ = require('lodash');

class HomeScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    return {
      title: "Today's English phrases",
      headerRight: (
        <Icon.Button
          name='refresh'
          color='blue'
          backgroundColor='transparent'
          onPress={() => params.refreshPickups()}
        />
      ),
    };
  };

  componentDidMount() {
    this.props.navigation.setParams({
      refreshPickups: this._refreshPickups.bind(this),
    });
  }

  _refreshPickups() {
    const now = new Date();
    realm.write(() => {
      this._pickupdPhrases.snapshot().forEach(phrase => {
        phrase.pickupd = false;
        phrase.updatedAt = now;
      });
    });
    this.setState({
      _data: this._pickupPhrases(),
    });
  }

  constructor(props) {
    super(props);
    // realm.write(() => {
    //   realm.objects('Phrase').snapshot().forEach(p => p.completedAt = null);
    // });
    // if (realm.objects('Phrase').length == 0) {
    //   const importer = new Importer();
    //   importer.import();
    // }

    var phrases = this._pickupdPhrases.slice();
    if (phrases.length == 0) {
      phrases = this._pickupPhrases();
    }
    this.state = {
      _data: phrases,
      modalVisible: false,
      selectedPhrase: {},
    };
  }

  get _pickupdPhrases() {
    return realm.objects('Phrase').filtered('pickupd = $0', true);
  }

  _pickupPhrases() {
    const now = new Date();
    const pickupd = realm.objects('Phrase').filtered('completedAt = $0', null).slice(0, 8);
    realm.write(() => {
      pickupd.forEach(phrase => {
        phrase.pickupd = true;
        phrase.updatedAt = now;
      });
    });

    return pickupd;
  }

  _completePhrase(item, index) {
    // Update phrase's status.
    const now = new Date();
    realm.write(() => {
      item.completedAt = (item.isCompleted()) ? null : now; // toggle status
      item.updatedAt = now;
    });
    // Update lists for display.
    this.setState({
      _data: _.clone(this.state._data),
    });
  }

  _setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  _showPhraseFor(phrase) {
    this.setState({ selectedPhrase: phrase });
    this._setModalVisible(true);
  }

  _renderTags(item) {
    return (
      <View style={styles.tagView}>
        {
          item.tags.map((tag, index) => {
            return (
              <View style={styles.tagInnerView} key={index}>
                <Text style={styles.tagText}>
                  #{tag.name}
                </Text>
              </View>
            );
          })
        }
      </View>
    );
  }

  _renderItem({ item, index }) {
    const swipeBtns = [{
      text: (item.isCompleted()) ? 'Revert' : 'Complete',
      backgroundColor: 'blue',
      underlayColor: 'rgba(0,0,0,1)',
      onPress: () => { this._completePhrase(item, index) }
    }];

    return (
      <Swipeout
        right={swipeBtns}
        autoClose={true}
        backgroundColor='transparent'>
        <TouchableHighlight
          underlayColor='rgba(192,192,192,1)'
          onPress={() => { this._showPhraseFor(item) }} >
          <View style={[styles.phraseView, item.isCompleted() && styles.phraseDoneView]}>
            <View style={styles.phraseSentenceView}>
              <View style={styles.phraseSentenceBodyView}>
                <Text
                  style={styles.phraseText}
                  ellipsizeMode='tail'
                  numberOfLines={1} >
                  {item.key}
                </Text>
              </View>
              <View style={styles.phraseSentenceAppendixView}>
                <Text style={[styles.phraseText, styles.phraseSentenceAppendixText]} >
                  >
                </Text>
              </View>
            </View>
            {this._renderTags(item)}
            <Text style={styles.phraseCreatedAtText}>
              {item.createdAt.toLocaleString('en-US')}
            </Text>
          </View>
        </TouchableHighlight>
      </Swipeout>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state._data}
          renderItem={this._renderItem.bind(this)}
          keyExtractor={(item, index) => item.key}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />

        <Modal
          animationIn='fadeIn'
          animationOut='fadeOut'
          animationInTiming={100}
          animationOutTiming={100}
          isVisible={this.state.modalVisible}
          onRequestClose={() => {}} >
          <TouchableWithoutFeedback // This touchable closes modal.
            onPress={() => { this._setModalVisible(false) }} >
            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }} >
              <View style={{ height: '20%', backgroundColor: 'white', padding: 10 }}>
                <Text style={{ fontSize: 16, lineHeight: 28 }}>
                  {this.state.selectedPhrase.sentence}
                </Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    );
  }
}

const SimpleApp = StackNavigator({
  Home: { screen: HomeScreen }
});

export default class App extends React.Component {
  // render() {
  //   return <SimpleApp />;
  // }
  _signIn() {
    // console.log('foo');
  }

  render() {
    GoogleSignin.hasPlayServices({ autoResolve: true }).then(() => {
      // play services are available. can now configure library
    })
    .catch((err) => {
      console.log("Play services error", err.code, err.message);
    });

    GoogleSignin.configure({
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      iosClientId: '208998088995-o9ki8qrtvjs3ac6cu4vaj3mefka8bhej.apps.googleusercontent.com', // only for iOS
    })
    .then(() => {
      // you can now call currentUserAsync()
      // console.log('foo');
    });

    GoogleSignin.signIn()
    .then((user) => {
      console.log(user);
      // this.setState({ user: user });
      var endpoint = 'https://sheets.googleapis.com/v4/spreadsheets';
      var sheetId = '15NvtH2b6UmzsH2WF0dh9ema8lPX7_E6XMVlecCtKbaE';

      fetch(`${endpoint}/${sheetId}/values/Sheet1!A2:Y999/?access_token=${user.accessToken}`)
      .then((response) => {
        response.json().then((data) => {
          const keys = ['id', 'sentence', 'tags', 'completedAt', 'createdAt', 'updatedAt'];
          const rows = data.values.map(row => {
            return keys.reduce((retObj, key, index) => {
              retObj[key] = row[index];
              return retObj;
            }, {});
          });
          const importer = new Importer();
          importer.import(rows);
        });
      });

      // const phraseSheetValues = realm.objects('Phrase').map(phrase => phrase.sheetValues);
      // fetch(`${endpoint}/${sheetId}/values/Sheet1!A2:Y999/?access_token=${user.accessToken}&valueInputOption=USER_ENTERED`, {
      //   method: 'PUT',
      //   body: JSON.stringify({
      //     values: phraseSheetValues,
      //   })
      // })
      // .then((response) => {
      //   response.json().then((data) => {
      //       console.log(data);
      //       // store.dispatch(nameGet(data.properties.title));
      //   });
      // });
    })
    .catch((err) => {
      console.log('WRONG SIGNIN', err);
    })
    .done();

    return (
      <GoogleSigninButton
        style={{ width: 230, height: 48 }}
        size={GoogleSigninButton.Size.Standard}
        color={GoogleSigninButton.Color.Dark} />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center'
  },
  separator: {
    height: 1,
    backgroundColor: "#CED0CE",
  },
  phraseView: {
    padding: 10,
    height: 72,
  },
  phraseDoneView: {
    backgroundColor: 'lightgray',
  },
  phraseText: {
    fontSize: 18,
    marginBottom: 2,
  },
  phraseCreatedAtText: {
    color: 'dimgray',
    fontSize: 9,
  },
  phraseSentenceView: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  phraseSentenceBodyView: {
    width: '95%',
  },
  phraseSentenceAppendixView: {
    width: '5%',
  },
  phraseSentenceAppendixText: {
    textAlign: 'right',
    color: 'lightgray',
  },
  tagView: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    marginBottom: 3,
  },
  tagInnerView: {
    marginRight: 5,
  },
  tagText: {
    color: 'midnightblue',
    fontSize: 11,
  },
})
