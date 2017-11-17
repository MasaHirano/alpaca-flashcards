import { createAction } from 'redux-actions';

export const REQUEST_COMPLETE_PHRASE = 'REQUEST_COMPLETE_PHRASE';
export const requestCompletePhrase = createAction(REQUEST_COMPLETE_PHRASE);

export const REQUEST_ARCHIVE_PICKUPS = 'REQUEST_ARCHIVE_PICKUPS';
export const requestArchivePickups = createAction(REQUEST_ARCHIVE_PICKUPS);

export const REQUEST_SHOW_PHRASE = 'REQUEST_SHOW_PHRASE';
export const requestShowPhrase = createAction(REQUEST_SHOW_PHRASE);

export const REQUEST_CLOSE_MODAL = 'REQUEST_CLOSE_MODAL';
export const requestCloseModal = createAction(REQUEST_CLOSE_MODAL);

export const REQUEST_REFRESH_PHRASES = 'REQUEST_REFRESH_PHRASES';
export const requestRefreshPhrases = createAction(REQUEST_REFRESH_PHRASES);

export const REQUEST_IMPORT_PHRASES = 'REQUEST_IMPORT_PHRASES';
export const requestImportPhrases = createAction(REQUEST_IMPORT_PHRASES);