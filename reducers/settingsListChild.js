import realm from '../app/db/realm';

import {
  SUCCESS_RETRIEVE_GOOGLE_FILES,
  SUCCESS_RETRIEVE_GOOGLE_SHEETS,
} from '../actions';

function initializeState() {
  return {
    items: [],
  };
}

export default function reducer(state = initializeState(), action) {
  console.log(`[reducer]${action.type} called. payload: %O, state: %O`, action.payload, state);
  switch (action.type) {
    case SUCCESS_RETRIEVE_GOOGLE_FILES:
      return Object.assign({}, state, {
        items: action.payload.map(row => ({ displayName: row.name, data: row })),
      });

    case SUCCESS_RETRIEVE_GOOGLE_SHEETS:
      return Object.assign({}, state, {
        items: action.payload,
      });

    default:
      return state;
  }
}
