import {
  REQUEST_RETRIEVE_GOOGLE_FILES,
  REQUEST_RETRIEVE_GOOGLE_SHEETS,
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
    case REQUEST_RETRIEVE_GOOGLE_FILES:
    case REQUEST_RETRIEVE_GOOGLE_SHEETS:
      return Object.assign({}, state, {
        items: [],
      });

    case SUCCESS_RETRIEVE_GOOGLE_FILES:
    case SUCCESS_RETRIEVE_GOOGLE_SHEETS:
      return Object.assign({}, state, {
        items: action.payload,
      });

    default:
      return state;
  }
}
