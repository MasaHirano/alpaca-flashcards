import {
  SUCCESS_RETRIEVE_GOOGLE_USER,
  SUCCESS_GOOGLE_SIGN_IN,
  SUCCESS_GOOGLE_SIGN_OUT,
} from '../actions';

function initializeState() {
  return {
    user: {}, // @see https://github.com/devfd/react-native-google-signin#3-user
  };
}

export default function reducer(state = initializeState(), action) {
  console.log(`[reducer]${action.type} called. payload: %O, state: %O`, action.payload, state);
  switch (action.type) {
    case SUCCESS_RETRIEVE_GOOGLE_USER:
    case SUCCESS_GOOGLE_SIGN_IN:
      return Object.assign({}, state, action.payload);

    case SUCCESS_GOOGLE_SIGN_OUT:
      return Object.assign({}, state, {
        user: {},
      });

    default:
      return state;
  }
}
