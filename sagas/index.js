import { fork } from 'redux-saga/effects'

import * as phrases from './phrases'

export default function* rootSaga() {
  yield fork(phrases.handleUpdateGoogleSheet)
  // yield fork(auth.handleCheckLogin)
  // yield fork(auth.handleLogout)
}
