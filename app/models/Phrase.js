export default class Phrase {
  get key() {
    return this.sentence;
  }

  get sheetValues() {
    return [
      this.id,
      this.sentence,
      this.tags.map(tag => tag.name).join(','),
      this.completedAt,
      this.createdAt,
      this.updatedAt,
    ];
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