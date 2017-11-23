import { AsyncStorage } from 'react-native';
import { call, put, select, take } from 'redux-saga/effects';
import { GoogleSignin } from 'react-native-google-signin';
import _ from 'lodash';

import Config from '../app/config';
import realm from '../app/db/realm';
import {
  REQUEST_RETRIEVE_GOOGLE_USER,
  REQUEST_GOOGLE_SIGN_IN,
  REQUEST_GOOGLE_SIGN_OUT,
  successRetrieveGoogleUser,
  successGoogleSignIn,
  successGoogleSignOut,
} from '../actions';

export function* handleGoogleSignOut() {
  while (true) {
    const action = yield take(REQUEST_GOOGLE_SIGN_OUT);
    console.log('[saga]handleGoogleSignOut. action: %O', action);

    try {
      yield call([GoogleSignin, 'signOut']);
    } catch (error) {
      console.error('[saga]handleReadGoogleSheetInfo. %O', error);
      continue;
    }

    const keyValuePairs = [
      ['GoogleSpreadsheet.id', ''],
      ['GoogleSpreadsheet.name', ''],
      ['GoogleSpreadsheet.title', ''],
    ];
    try {
      yield call([AsyncStorage, 'multiSet'], keyValuePairs);
    } catch (error) {
      console.error('[saga]handleReadGoogleSheetInfo. %O', error);
      continue;
    }

    yield put(successGoogleSignOut());
  }
}

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
