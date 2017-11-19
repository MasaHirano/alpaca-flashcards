import realm from '../app/db/realm';

import {
  // REQUEST_RETRIEVE_GOOGLE_USER,
  SUCCESS_RETRIEVE_GOOGLE_USER,
  SUCCESS_GOOGLE_SIGN_IN,
} from '../actions';

function initializeState() {
  return {
    sheets: [],        // List of spreadsheets
    innerSheets: [],   // List of titles in a spreadsheet
    user: {},          // Google user objects
    sheetId: null,     // Active sheeetId
    sheetTitle: null,  // Active sheetTitle
  };
}

export default function reducer(state = initializeState(), action) {
  console.log(`[reducer]${action.type} called. payload: %O, state: %O`, action.payload, state);
  switch (action.type) {
    case SUCCESS_RETRIEVE_GOOGLE_USER:
    case SUCCESS_GOOGLE_SIGN_IN:
      return Object.assign({}, state, action.payload);

    default:
      return state;
  }
}
