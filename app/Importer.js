import Phrase from './models/Phrase';
import Tag from './models/Tag';
import realm from './db/realm';

const _ = require('lodash');

export default class Importter {

  constructor() {
  }

  import(phrases) {
    for (let row of phrases) {
      realm.write(() => {
        const tags = this._saveTags(row);
        this._savePhrase(row, tags);
      });
    }
  }

  _calculateNextIdOf(model) {
    var maxId = realm.objects(model).max('id');
    return isNaN(maxId) ? 1 : ++maxId;
  }

  _saveTags(row) {
    const tagNames = row['tags'].split(',').map(t => t.trim());
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