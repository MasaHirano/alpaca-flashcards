import { AsyncStorage } from 'react-native';
import { call, put, select, take } from 'redux-saga/effects';
import { GoogleSignin } from 'react-native-google-signin';
import _ from 'lodash';

import Config from '../app/config';
import Importer from '../app/Importer';
import realm from '../app/db/realm';
import {
  REQUEST_UPDATE_GOOGLE_SHEET,
  REQUEST_READ_GOOGLE_SHEET_INFO,
  REQUEST_REFRESH_PHRASES,
  requestRetrieveGoogleUser,
  requestReadGoogleSheetInfo,
  requestUpdateGoogleSheet,
  successReadGoogleSheetInfo,
} from '../actions';

export function* handleReadGoogleSheetInfo() {
  while (true) {
    const action = yield take(REQUEST_READ_GOOGLE_SHEET_INFO);
    console.log('[saga]handleReadGoogleSheetInfo. action: %O', action);

    try {
      const keys = ['GoogleSpreadsheet.id', 'GoogleSpreadsheet.name', 'GoogleSpreadsheet.title', 'GoogleSpreadsheet.lastSyncedAt'];
      var stores = yield call([AsyncStorage, 'multiGet'], keys);
    } catch (error) {
      console.error('[saga]handleReadGoogleSheetInfo. %O', error);
      continue;
    }
    console.log('[saga]handleUpdateGoogleSheet. stores: %O', stores);

    const sheetInfo = _.fromPairs(stores);
    const spreadsheet = {
      id: sheetInfo['GoogleSpreadsheet.id'],
      name: sheetInfo['GoogleSpreadsheet.name'],
      title: sheetInfo['GoogleSpreadsheet.title'],
      lastSyncedAt: sheetInfo['GoogleSpreadsheet.lastSyncedAt'],
    };

    yield put(successReadGoogleSheetInfo({ spreadsheet }));
  }
}

export function* handleUpdateGoogleSheet() {
  while (true) {
    const action = yield take(REQUEST_UPDATE_GOOGLE_SHEET);

    yield put(requestRetrieveGoogleUser());
    yield put(requestReadGoogleSheetInfo());

    const [user, spreadsheet] = yield select((state) => _.at(state, ['signin.user', 'phrases.spreadsheet']));
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

    _saveLastSyncedAt(new Date());
  }
}

export function* handleRefreshPhrases() {
  while (true) {
    const action = yield take(REQUEST_REFRESH_PHRASES);

    const [user, spreadsheet] = yield select((state) => _.at(state, ['signin.user', 'phrases.spreadsheet']));
    const endpoint = Config.googleAPI.sheetsEndpoint;

    const successfullyImported = yield call(_importData, { user, spreadsheet, endpoint });
    debugger
    if (successfullyImported) {
      yield put(requestUpdateGoogleSheet());
      _saveLastSyncedAt(new Date());
    }
  }
}

function _saveLastSyncedAt(date, onError = null) {
  if (onError === null) {
    onError = (error) => {
      if (! _.isEmpty(error)) {
        console.error(error);
      }
    };
  }
  AsyncStorage.setItem('GoogleSpreadsheet.lastSyncedAt', date,  onError);
}

function _importData({ user, spreadsheet, endpoint }) {
  return fetch(`${endpoint}/${spreadsheet.id}/values/Sheet1!A2:F999`, {
    headers: { 'Authorization': `Bearer ${user.accessToken}` },
  })
  .then((response) => response.json())
  .then((responseJson) => {
    const importer = new Importer();
    importer.import(responseJson.values);
    return true;
  })
  .catch((error) => {
    console.error('_importData ', error);
    return false;
  });
}