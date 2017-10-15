export default class Phrase {
  get key() {
    return this.sentence;
  }

  isDone() {
    return this.status == 1;
  }
};

Phrase.schema = {
  name: 'Phrase',
  primaryKey: 'id',
  properties: {
    id:          'int',
    sentence:    'string',
    status:      { type: 'int', default: 0 },          // 0: undone, 1: done, 2: archived
    tags:        { type: 'list', objectType: 'Tag' },
    pickupd:     { type: 'bool', default: false },
    completedAt: { type: 'date', optional: true },
    createdAt:   { type: 'date', default: new Date() },
    updatedAt:   { type: 'date', default: new Date() },
  }
};