import { fork } from 'redux-saga/effects'

import * as phrases from './phrases'
import * as signin from './signin'

export default function* rootSaga() {
  yield fork(phrases.handleUpdateGoogleSheet);
  yield fork(phrases.handleReadGoogleSheetInfo);

  yield fork(signin.handleRetrieveGoogleUser);
  yield fork(signin.handleGoogleSignIn);
  yield fork(signin.handleGoogleSignOut);
}
