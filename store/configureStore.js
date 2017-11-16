import { createStore, combineReducers, applyMiddleware } from 'redux';

import * as rootReducer from '../reducers';

export default function configureStore() {
  const store = createStore(
    combineReducers({
      ...rootReducer,
    }),
  );

  return store;
};
