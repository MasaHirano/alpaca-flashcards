import { AsyncStorage } from 'react-native';
import { call, put, select, take } from 'redux-saga/effects';
import { GoogleSignin } from 'react-native-google-signin';
import _ from 'lodash';

import Config from '../app/config';
import realm from '../app/db/realm';
import {
  REQUEST_RETRIEVE_GOOGLE_USER,
  successRetrieveGoogleUser,
  REQUEST_GOOGLE_SIGN_IN,
  successGoogleSignIn,
} from '../actions';

export function* handleGoogleSignIn() {
  while (true) {
    const action = yield take(REQUEST_GOOGLE_SIGN_IN);
    console.log('[saga]handleGoogleSignIn. action: %O', action);

    const user = yield call([GoogleSignin, 'signIn']);

    yield put(successGoogleSignIn({ user }));
  }
}

export function* handleRetrieveGoogleUser() {
  while (true) {
    const action = yield take(REQUEST_RETRIEVE_GOOGLE_USER);
    console.log('[saga]handleRetrieveGoogleUser. action: %O', action);

    yield call([GoogleSignin, 'configure'], Config.googleSignin);
    const user = yield call([GoogleSignin, 'currentUserAsync']);
    console.log('[saga]handleRetrieveGoogleUser. user: %O', user);
    if (user === null) {
      continue;
    }

    yield put(successRetrieveGoogleUser({ user }));
  }
}

// export function* handleReadGoogleSheetInfo() {
//   while (true) {
//     const action = yield take(REQUEST_READ_GOOGLE_SHEET_INFO);
//     console.log('[saga]handleReadGoogleSheetInfo. action: %O', action);

//     try {
//       var stores = yield call([AsyncStorage, 'multiGet'], ['GoogleSpreadsheet.id', 'GoogleSpreadsheet.title', 'GoogleSpreadsheet.lastSyncedAt']);
//     } catch (error) {
//       console.error('[saga]handleReadGoogleSheetInfo. %O', error);
//       continue;
//     }
//     console.log('[saga]handleUpdateGoogleSheet. stores: %O', stores);

//     const sheetInfo = _.fromPairs(stores);
//     const spreadsheet = {
//       id: sheetInfo['GoogleSpreadsheet.id'],
//       title: sheetInfo['GoogleSpreadsheet.title'],
//       lastSyncedAt: sheetInfo['GoogleSpreadsheet.lastSyncedAt'],
//     };

//     yield put(successReadGoogleSheetInfo({ spreadsheet }));
//   }
// }