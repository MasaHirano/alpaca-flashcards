import { AsyncStorage } from 'react-native';
import { call, put, select, take } from 'redux-saga/effects';
import { GoogleSignin } from 'react-native-google-signin';
import _ from 'lodash';

import Config from '../app/config';
import realm from '../app/db/realm';
import {
  REQUEST_UPDATE_GOOGLE_SHEET,
  successRetrieveGoogleUser,
  successReadGoogleSheetInfo,
} from '../actions/phrases'

export function* handleUpdateGoogleSheet() {
  while (true) {
    const action = yield take(REQUEST_UPDATE_GOOGLE_SHEET);
    console.log('[saga]handleUpdateGoogleSheet. action: %o', action);

    yield call(GoogleSignin.configure, Config.googleSignin);

    const user = yield call([GoogleSignin, 'currentUserAsync']);
    console.log('[saga]handleUpdateGoogleSheet. user: %O', user);
    if (user === null) {
      continue;
    }

    yield put(successRetrieveGoogleUser({ user }));

    try {
      var stores = yield call([AsyncStorage, 'multiGet'], ['GoogleSpreadsheet.id', 'GoogleSpreadsheet.title', 'GoogleSpreadsheet.lastSyncedAt']);
    } catch (error) {
      console.error('[saga]handleUpdateGoogleSheet. %O', error);
      continue;
    }
    console.log('[saga]handleUpdateGoogleSheet. stores: %O', stores);

    const sheetInfo = _.fromPairs(stores);
    const spreadsheet = {
            id: sheetInfo['GoogleSpreadsheet.id'],
            title: sheetInfo['GoogleSpreadsheet.title'],
            lastSyncedAt: sheetInfo['GoogleSpreadsheet.lastSyncedAt'],
          };
    yield put(successReadGoogleSheetInfo({ spreadsheet }));

    if ([user, ..._.at(spreadsheet, ['id', 'title'])].some(_.isEmpty)) {
      continue;
    }

    // Batch update to spreadsheet.
    const endpoint = Config.googleAPI.sheetsEndpoint,
          lastSyncedAt = new Date(spreadsheet.lastSyncedAt);
    const recentlyUpdated = realm.objects('Phrase').filtered('updatedAt > $0', lastSyncedAt);

    const response = yield call(() => {
      return fetch(`${endpoint}/${spreadsheet.id}/values:batchUpdate`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${user.accessToken}` },
        body: JSON.stringify({
          valueInputOption: 'USER_ENTERED',
          data: recentlyUpdated.map(phrase => {
            return {
              range: `${spreadsheet.title}!A${phrase.id + 1}:F${phrase.id + 1}`,
              majorDimension: 'ROWS',
              values: [phrase.sheetValues],
            };
          }),
        }),
      })
      .then((response) => response);
    });
    console.log('[saga]handleUpdateGoogleSheet. API-call result: %O', response);

    AsyncStorage.setItem('GoogleSpreadsheet.lastSyncedAt', new Date(), (error) => {
      if (! _.isEmpty(error)) {
        console.error(error);
      }
    });
  }
}
