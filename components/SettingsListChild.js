import React from 'react';
import { FlatList, StyleSheet, Text, View, TouchableHighlight } from 'react-native';

export default class SettingsListChild extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.navigation.state.params.onDidMount();
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.props.settingsListChild.items}
          renderItem={this._renderItem.bind(this)}
          keyExtractor={(item, index) => index}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>
    );
  }

  _renderItem({ item, index }) {
    const { navigation } = this.props,
          { onSelectListRow } = navigation.state.params;

    return (
      <TouchableHighlight
        underlayColor='rgba(192,192,192,1)'
        // onPress={() => { this._saveSelectedData({ item, index }) }} >
        onPress={() => {
          onSelectListRow({ item: item.data, index })
          navigation.goBack();
        }} >
        <View style={styles.phraseView} >
          <Text>
            {item.displayName}
          </Text>
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: "#CED0CE",
  },
  phraseView: {
    padding: 10,
    height: 48,
  },
});
