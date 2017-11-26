import { createAction } from 'redux-actions';

export const REQUEST_RETRIEVE_GOOGLE_FILES = 'REQUEST_RETRIEVE_GOOGLE_FILES';
export const requestRetrieveGoogleFiles = createAction(REQUEST_RETRIEVE_GOOGLE_FILES);
export const SUCCESS_RETRIEVE_GOOGLE_FILES = 'SUCCESS_RETRIEVE_GOOGLE_FILES';
export const successRetrieveGoogleFiles = createAction(SUCCESS_RETRIEVE_GOOGLE_FILES);

export const REQUEST_SELECT_GOOGLE_FILE = 'REQUEST_SELECT_GOOGLE_FILE';
export const requestSelectGoogleFile = createAction(REQUEST_SELECT_GOOGLE_FILE);

export const REQUEST_RETRIEVE_GOOGLE_SHEETS = 'REQUEST_RETRIEVE_GOOGLE_SHEETS';
export const requestRetrieveGoogleSheets = createAction(REQUEST_RETRIEVE_GOOGLE_SHEETS);
export const SUCCESS_RETRIEVE_GOOGLE_SHEETS = 'SUCCESS_RETRIEVE_GOOGLE_SHEETS';
export const successRetrieveGoogleSheets = createAction(SUCCESS_RETRIEVE_GOOGLE_SHEETS);

export const REQUEST_SELECT_GOOGLE_SHEET = 'REQUEST_SELECT_GOOGLE_SHEET';
export const requestSelectGoogleSheet = createAction(REQUEST_SELECT_GOOGLE_SHEET);