import realm from '../app/db/realm';

import {
  REQUEST_COMPLETE_PHRASE,
  REQUEST_ARCHIVE_PICKUPS,
  REQUEST_SHOW_PHRASE,
  REQUEST_CLOSE_MODAL,
  REQUEST_REFRESH_PHRASES,
  REQUEST_IMPORT_PHRASES,
  REQUEST_RETRIEVE_GOOGLE_USER,
  REQUEST_READ_GOOGLE_SHEET_INFO,
} from '../actions';

function fetchPickedUpPhrases() {
  return realm.objects('Phrase').filtered('pickupd = $0', true);
}

function pickupPhrases() {
  const now = new Date();
  const pickupd = realm.objects('Phrase').filtered('completedAt = $0', null).slice(0, 8);
  realm.write(() => {
    pickupd.forEach(phrase => {
      phrase.pickupd = true;
      phrase.updatedAt = now;
    });
  });
  return pickupd;
}

function initializeState() {
  var phrases = fetchPickedUpPhrases().slice();
  if (phrases.length === 0) {
    phrases = pickupPhrases();
  }
  return {
    data: phrases,
    modalVisible: false,
    refreshing: false,
    selectedPhrase: {},
    user: {},
    spreadsheet: {},
  };
}

export default function reducer(state = initializeState(), action) {
  console.log(`reducer: ${action.type} called. payload: %o, state: %o`, action.payload, state);
  switch (action.type) {
    case REQUEST_ARCHIVE_PICKUPS:
    case REQUEST_SHOW_PHRASE:
    case REQUEST_RETRIEVE_GOOGLE_USER:
    case REQUEST_READ_GOOGLE_SHEET_INFO:
      return Object.assign({}, state, action.payload);

    case REQUEST_COMPLETE_PHRASE:
      return Object.assign({}, state); // Just for re-rendering.

    case REQUEST_CLOSE_MODAL:
      return Object.assign({}, state, {
        modalVisible: false,
      });

    case REQUEST_REFRESH_PHRASES:
      return Object.assign({}, state, {
        refreshing: true,
      });

    case REQUEST_IMPORT_PHRASES:
      return Object.assign({}, state, {
        refreshing: false,
        data: pickupPhrases(),
      });

    default:
      return state;
  }
}
