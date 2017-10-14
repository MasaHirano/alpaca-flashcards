export default class Tag {
};

Tag.schema = {
  name: 'Tag',
  primaryKey: 'id',
  properties: {
    id:      'int',
    name:    'string',
    phrases: { type: 'linkingObjects', objectType: 'Phrase', property: 'tags' },
  }
};