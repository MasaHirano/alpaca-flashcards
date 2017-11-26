import React from 'react';
import { FlatList, StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class SettingsList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container} >
        <FlatList
          data={this._getListData()}
          renderItem={this._renderItem.bind(this)}
          keyExtractor={(item, index) => item.key}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>
    );
  }

  _renderItem({ item, index }) {
    const { navigation } = this.props,
          { spreadsheet } = this.props.phrases,
          selectedItem = spreadsheet[item.key];

    return (
      <TouchableHighlight
        underlayColor='rgba(192,192,192,1)'
        onPress={() => this._onPress({ item, index })} >
        <View style={styles.phraseView} >
          <View style={{ width: '95%', justifyContent: 'center' }} >
            <Text>
              {item.name}: {selectedItem}
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
    this.props.navigation.navigate('SettingsListChild', {
      onDidMount: item.onDidMount,
      onSelectListRow: item.onSelectListRow,
    });
  }

  _getListData() {
    return [
      {
        key: 'name',
        name: 'Sheet ID',
        onDidMount: this.props.onDidMountFilesView,
        onSelectListRow: this.props.onPressFileListRow,
      },
      {
        key: 'title',
        name: 'Sheet Title',
        onDidMount: this.props.onDidMountSheetsView,
        onSelectListRow: this.props.onPressSheetsListRow,
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
