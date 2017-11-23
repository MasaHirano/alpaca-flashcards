/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import { FlatList, StyleSheet, Text, View, TouchableHighlight, TouchableWithoutFeedback, RefreshControl, AsyncStorage } from 'react-native';
import Swipeout from 'react-native-swipeout';
import Icon from 'react-native-vector-icons/FontAwesome';
import Modal from 'react-native-modal';
import { GoogleSignin } from 'react-native-google-signin';
import _ from 'lodash';

import realm from '../app/db/realm';
import Importer from '../app/Importer';
import Config from '../app/config';

export default class Phrases extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    return {
      title: "Today's English phrases",
      headerRight: (
        <Icon.Button
          name='archive'
          color='blue'
          backgroundColor='transparent'
          onPress={() => params.archivePickups()}
        />
      ),
    };
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.navigation.setParams({
      archivePickups: this._archivePickups.bind(this),
    });
    this.props.onUpdateGoogleSheet();
  }

  render() {
    return (
      <View style={styles.container} >
        <FlatList
          data={this.props.phrases.data}
          renderItem={this._renderItem.bind(this)}
          keyExtractor={(item, index) => item.key}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          refreshControl={
            <RefreshControl
              refreshing={this.props.phrases.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
        />

        <Modal
          animationIn='fadeIn'
          animationOut='fadeOut'
          animationInTiming={100}
          animationOutTiming={100}
          isVisible={this.props.phrases.modalVisible}
          onRequestClose={() => {}} >
          <TouchableWithoutFeedback // This touchable closes modal.
            onPress={this.props.onPressModal} >
            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }} >
              <View style={{ height: '20%', backgroundColor: 'white', padding: 10 }} >
                <Text style={{ fontSize: 16, lineHeight: 28 }} >
                  {this.props.phrases.selectedPhrase.sentence}
                </Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    );
  }

  get _pickupdPhrases() {
    return realm.objects('Phrase').filtered('pickupd = $0', true);
  }

  _archivePickups() {
    const now = new Date();
    realm.write(() => {
      this._pickupdPhrases.snapshot().forEach(phrase => {
        phrase.pickupd = false;
        phrase.updatedAt = now;
      });
    });
    this.props.onPressArchiveIcon();
  }

  _completePhrase({ item, index }) {
    // Update phrase's status.
    const now = new Date();
    realm.write(() => {
      item.completedAt = (item.isCompleted()) ? null : now; // toggle status
      item.updatedAt = now;
    });
    // Update lists for display.
    this.props.onPressSwipeCompleteButton();
  }

  _showPhraseFor(phrase) {
    const payload = { selectedPhrase: phrase, modalVisible: true };
    this.props.onPressPhraseList(payload);
  }

  _onRefresh() {
    this.props.onRefreshPhrases();
    AsyncStorage.setItem('GoogleSpreadsheet.lastSyncedAt', new Date(), (error) => {
      if (! _.isEmpty(error)) {
        console.error(error);
      }
    });
    this._importData();
  }

  _importData() {
    const endpoint = Config.googleAPI.sheetsEndpoint,
          { spreadsheet } = this.props.phrases,
          { user } = this.props.signin;

    fetch(`${endpoint}/${spreadsheet.id}/values/Sheet1!A2:F999`, {
      headers: { 'Authorization': `Bearer ${user.accessToken}` },
    })
    .then((response) => {
      response.json().then((data) => {
        const importer = new Importer();
        importer.import(data.values);
        this.props.onAfterRefreshPhrases();
      });
    });
  }

  _renderTags(item) {
    return item.tags.map((tag, index) => {
      return (
        <View style={styles.tagInnerView} key={index} >
          <Text style={styles.tagText} >
            #{tag.name}
          </Text>
        </View>
      );
    });
  }

  _renderItem({ item, index }) {
    const swipeBtns = [{
      text: (item.isCompleted()) ? 'Revert' : 'Complete',
      backgroundColor: 'blue',
      underlayColor: 'rgba(0,0,0,1)',
      onPress: () => { this._completePhrase({ item, index }) },
    }];

    return (
      <Swipeout
        right={swipeBtns}
        autoClose={true}
        backgroundColor='transparent' >
        <TouchableHighlight
          underlayColor='rgba(192,192,192,1)'
          onPress={() => { this._showPhraseFor(item) }} >
          <View style={[styles.phraseView, item.isCompleted() && styles.phraseDoneView]} >
            <View style={styles.phraseSentenceView} >
              <View style={styles.phraseSentenceBodyView} >
                <Text
                  style={styles.phraseText}
                  ellipsizeMode='tail'
                  numberOfLines={1} >
                  {item.key}
                </Text>
              </View>
              <View style={styles.phraseSentenceAppendixView} >
                <Icon
                  style={styles.phraseSentenceAppendixText}
                  name='angle-right'
                />
              </View>
            </View>
            <View style={styles.tagView} >
              {this._renderTags(item)}
            </View>
            <Text style={styles.phraseCreatedAtText} >
              {item.createdAt.toLocaleString('en-US')}
            </Text>
          </View>
        </TouchableHighlight>
      </Swipeout>
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
    paddingTop: 3,
    fontSize: 18,
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