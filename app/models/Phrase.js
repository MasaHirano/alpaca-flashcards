const tabSeparator = ',';

export default class Phrase {
  static get tagSeparator() {
    return tabSeparator;
  }

  static getFieldsTypeOf(type) {
    const props = this.schema.properties;
    return Object.keys(props).filter(field => {
      return (typeof props[field] === 'string')
        ? props[field] === type
        : props[field].type === type
        ;
    });
  }

  get key() {
    return this.sentence;
  }

  get sheetValues() {
    return [
      this.id,
      this.sentence,
      this.tags.map(tag => tag.name).join(Phrase.tabSeparator),
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