import { AsyncStorage } from 'react-native';
import { call, put, select, take } from 'redux-saga/effects';
import { GoogleSignin } from 'react-native-google-signin';
import _ from 'lodash';

import Config from '../app/config';
import realm from '../app/db/realm';
import {
  REQUEST_RETRIEVE_GOOGLE_FILES,
  REQUEST_RETRIEVE_GOOGLE_SHEETS,
  REQUEST_SELECT_GOOGLE_FILE,
  REQUEST_SELECT_GOOGLE_SHEET,
  successRetrieveGoogleFiles,
  successRetrieveGoogleSheets,
  successReadGoogleSheetInfo,
} from '../actions';

export function* handleRetrieveGoogleFiles() {
  while (true) {
    const action = yield take(REQUEST_RETRIEVE_GOOGLE_FILES);

    const user = yield select((state) => state.signin.user);

    const files = yield call(() => {
      return fetch("https://www.googleapis.com/drive/v3/files?q=mimeType%3D'application%2Fvnd.google-apps.spreadsheet'", {
        headers: { 'Authorization': `Bearer ${user.accessToken}` },
      })
      .then((response) => response.json())
      .then((responseJson) => responseJson.files);
    });

    const payload = files.map(row => ({ displayName: row.name, data: row }));
    yield put(successRetrieveGoogleFiles(payload));
  }
}

export function* handleRetrieveGoogleSheets() {
  while (true) {
    const action = yield take(REQUEST_RETRIEVE_GOOGLE_SHEETS);

    const [user, spreadsheet] = yield select((state) => _.at(state, ['signin.user', 'phrases.spreadsheet']));

    const sheets = yield call(() => {
      return fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheet.id}?includeGridData=false`, {
        headers: { 'Authorization': `Bearer ${user.accessToken}` },
      })
      .then((response) => response.json())
      .then((responseJson) => responseJson.sheets);
    });

    const payload = sheets.map(row => ({ displayName: row.properties.title, data: row }));
    yield put(successRetrieveGoogleSheets(payload));
  }
}

export function* handleSelectGoogleFile() {
  while (true) {
    const action = yield take(REQUEST_SELECT_GOOGLE_FILE);

    const spreadsheet = yield select((state) => state.phrases.spreadsheet);
    const selectedFile = action.payload.item;

    if (selectedFile.id === spreadsheet.id) {
      continue;
    }

    // Save sheetId to local storage.
    const keyValuePairs = [
      ['GoogleSpreadsheet.id', selectedFile.id],
      ['GoogleSpreadsheet.name', selectedFile.name],
      ['GoogleSpreadsheet.title', ''],
    ];
    try {
      yield call([AsyncStorage, 'multiSet'], keyValuePairs);
    } catch (errors) {
      console.error('[saga]handleSelectGoogleFile. %O', errors);
      continue;
    }

    const payload = {
      spreadsheet: Object.assign({}, spreadsheet, {
        id: selectedFile.id,
        name: selectedFile.name,
        title: null,
      }),
    };

    yield put(successReadGoogleSheetInfo(payload));
  }
}

export function* handleSelectGoogleSheet() {
  while (true) {
    const action = yield take(REQUEST_SELECT_GOOGLE_SHEET);

    const spreadsheet = yield select((state) => state.phrases.spreadsheet);
    const selectedSheet = action.payload.item,
          selectedSheetTitle = selectedSheet.properties.title;

    if (selectedSheetTitle === spreadsheet.title) {
      continue;
    }

    // Save sheetTitle to local storage.
    try {
      yield call([AsyncStorage, 'setItem'], 'GoogleSpreadsheet.title', selectedSheetTitle);
    } catch (error) {
      console.error('[saga]handleSelectGoogleSheet. %O', error);
      continue;
    }

    const payload = {
      spreadsheet: Object.assign({}, spreadsheet, {
        title: selectedSheetTitle,
      }),
    };

    yield put(successReadGoogleSheetInfo(payload));
  }
}