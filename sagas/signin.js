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

export function* handleGoogleSignIn() {
  while (true) {
    const action = yield take(REQUEST_GOOGLE_SIGN_IN);

    const user = yield call([GoogleSignin, 'signIn']);

    yield put(successGoogleSignIn({ user }));
  }
}

export function* handleGoogleSignOut() {
  while (true) {
    const action = yield take(REQUEST_GOOGLE_SIGN_OUT);

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

export function* handleRetrieveGoogleUser() {
  while (true) {
    const action = yield take(REQUEST_RETRIEVE_GOOGLE_USER);

    yield call([GoogleSignin, 'configure'], Config.googleSignin);
    const user = yield call([GoogleSignin, 'currentUserAsync']);
    if (user === null) {
      continue;
    }

    yield put(successRetrieveGoogleUser({ user }));
  }
}
