export default class Phrase {
  get key() {
    return this.sentence;
  }

  isCompleted() {
    return (this.completedAt instanceof Date);
  }
};

Phrase.schema = {
  name: 'Phrase',
  primaryKey: 'id',
  properties: {
    id:          'int',
    sentence:    'string',
    tags:        { type: 'list', objectType: 'Tag' },
    pickupd:     { type: 'bool', default: false },
    completedAt: { type: 'date', optional: true },
    createdAt:   { type: 'date', default: new Date() },
    updatedAt:   { type: 'date', default: new Date() },
  }
};