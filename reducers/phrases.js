import {
  REQUEST_COMPLETE_PHRASE,
} from '../actions';

function initializeState() {
  return {
    data: [],
  };
};

export default function reducer(state = initializeState(), action) {
  switch (action.type) {
    case REQUEST_COMPLETE_PHRASE:
      console.log('reducer: REQUEST_COMPLETE_PHRASE called. payload: ', action.payload);
      return Object.assign({}, state, {
        data: state.data,
      });

    default:
      return state;
  }
}
