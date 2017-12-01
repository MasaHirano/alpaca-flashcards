import React from 'react';
import { FlatList, StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Phrase from '../app/models/Phrase';
import SettingsListChild from './SettingsListChild';

export default class SettingsList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container} >
        <FlatList
          data={this._generateListData()}
          renderItem={this._renderItem.bind(this)}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>
    );
  }

  _renderItem({ item, index }) {
    return (
      <TouchableHighlight
        underlayColor='rgba(192,192,192,1)'
        onPress={() => this._onPress({ item, index })} >
        <View style={styles.phraseView} >
          <View style={{ width: '95%', justifyContent: 'center' }} >
            <Text>
              {item.key}: {item.value}
            </Text>
          </View>
          <View style={{ width: '5%', justifyContent: 'center' }} >
            <Icon
              style={{ textAlign: 'right', color: 'lightgray' }}
              name='angle-right'
              size={16}
           />
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  _onPress({ item, index }) {
    this.props.navigation.navigate(SettingsListChild.name, {
      onDidMount: item.onDidMount,
      onSelectListRow: item.onSelectListRow,
    });
  }

  _generateListData() {
    const {
      phrases,
      onDidMountFilesView, onPressFileListRow,
      onDidMountSheetsView, onPressSheetsListRow
    } = this.props;
    const { spreadsheet } = phrases;

    return [
      {
        key: 'File name',
        value: spreadsheet.name,
        onDidMount: onDidMountFilesView,
        onSelectListRow: onPressFileListRow,
      },
      {
        key: 'Sheet title',
        value: spreadsheet.title,
        onDidMount: onDidMountSheetsView,
        onSelectListRow: onPressSheetsListRow,
      },
    ];
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    marginTop: 10,
  },
  separator: {
    height: 1,
    backgroundColor: "#CED0CE",
    marginLeft: 10,
  },
  phraseView: {
    padding: 10,
    height: 42,
    flexDirection: 'row',
  },
});
