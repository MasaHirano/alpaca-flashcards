import _ from 'lodash';

import Phrase from './models/Phrase';
import Tag from './models/Tag';
import realm from './db/realm';

export default class Importer {
  import(rows) {
    const keys = ['id', 'sentence', 'tags', 'completedAt', 'createdAt', 'updatedAt'];
    rows.forEach(row => {
      const phraseRow = _.zipObject(keys, row);
      realm.write(() => {
        const tags = this._saveTags(phraseRow);
        this._savePhrase(phraseRow, tags);
      });
    });
  }

  _calculateNextIdOf(model) {
    return _.add(realm.objects(model).max('id'), 1);
  }

  _saveTags(row) {
    const tagNames = row['tags'].split(Phrase.tabSeparator).map(t => t.trim());
    const filterQuery = tagNames.map((_, i) => `name = $${i}`).join(' OR ');
    const tags = realm.objects('Tag').filtered(filterQuery, ...tagNames);
    _.difference(tagNames, tags.map(t => t.name)).forEach(newTagName => {
      realm.create('Tag', {
        id: this._calculateNextIdOf('Tag'),
        name: newTagName,
      });
    });
    // RealmResults are automatically updated.
    return tags;
  }

  _savePhrase(row, tags) {
    var params = { id: parseInt(row['id'], 10), sentence: row['sentence'], tags: tags };
    ['completedAt', 'createdAt', 'updatedAt'].forEach(field => {
      const dateValue = new Date(row[field]);
      if (! isNaN(dateValue)) {
        params[field] = dateValue;
      }
    });
    return realm.create('Phrase', params, true);
  }
}