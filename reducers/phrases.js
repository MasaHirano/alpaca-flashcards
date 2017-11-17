import {
  REQUEST_COMPLETE_PHRASE,
  REQUEST_ARCHIVE_PICKUPS,
  REQUEST_SHOW_PHRASE,
  REQUEST_CLOSE_MODAL,
  REQUEST_REFRESH_PHRASES,
  REQUEST_IMPORT_PHRASES,
} from '../actions';

const initialState = {
  data: [],
  modalVisible: false,
  selectedPhrase: {},
};

export default function reducer(state = initialState, action) {
  console.log(state);
  console.log(`reducer: ${action.type} called. payload: `, action.payload);
  switch (action.type) {
    case REQUEST_COMPLETE_PHRASE:
    case REQUEST_ARCHIVE_PICKUPS:
    case REQUEST_SHOW_PHRASE:
      return Object.assign({}, state, action.payload);

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
        data: action.payload.data,
      });

    default:
      return state;
  }
}
