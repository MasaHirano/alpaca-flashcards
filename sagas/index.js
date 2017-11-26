import { fork } from 'redux-saga/effects'

import * as phrases from './phrases'
import * as signin from './signin'
import * as settingsListChild from './settingsListChild'

export default function* rootSaga() {
  yield fork(phrases.handleUpdateGoogleSheet);
  yield fork(phrases.handleReadGoogleSheetInfo);
  yield fork(phrases.handleRefreshPhrases);

  yield fork(signin.handleRetrieveGoogleUser);
  yield fork(signin.handleGoogleSignIn);
  yield fork(signin.handleGoogleSignOut);

  yield fork(settingsListChild.handleRetrieveGoogleFiles);
  yield fork(settingsListChild.handleRetrieveGoogleSheets);
  yield fork(settingsListChild.handleSelectGoogleFile);
  yield fork(settingsListChild.handleSelectGoogleSheet);
}
