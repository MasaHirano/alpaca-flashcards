import Phrase from '../models/Phrase';
import Tag from '../models/Tag';

const Realm = require('realm');
console.log(Realm.defaultPath);

export default new Realm({ schema: [Phrase, Tag], schemaVersion: 3 });