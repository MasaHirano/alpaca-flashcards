export default class GoogleInfo {
};

Tag.schema = {
  name: 'GoogleInfo',
  primaryKey: 'id',
  properties: {
    id:         'int',
    sheetId:    'string',
    sheetTitle: 'string',
    createdAt:  { type: 'date', default: new Date() },
    updatedAt:  { type: 'date', default: new Date() },
  }
};