import { createAction } from 'redux-actions';

export const REQUEST_RETRIEVE_GOOGLE_USER = 'REQUEST_RETRIEVE_GOOGLE_USER';
export const requestRetrieveGoogleUser = createAction(REQUEST_RETRIEVE_GOOGLE_USER);
export const SUCCESS_RETRIEVE_GOOGLE_USER = 'SUCCESS_RETRIEVE_GOOGLE_USER';
export const successRetrieveGoogleUser = createAction(SUCCESS_RETRIEVE_GOOGLE_USER);

export const REQUEST_GOOGLE_SIGN_IN = 'REQUEST_GOOGLE_SIGN_IN';
export const requestGoogleSignIn = createAction(REQUEST_GOOGLE_SIGN_IN);
export const SUCCESS_GOOGLE_SIGN_IN = 'SUCCESS_GOOGLE_SIGN_IN';
export const successGoogleSignIn = createAction(SUCCESS_GOOGLE_SIGN_IN);

export const REQUEST_GOOGLE_SIGN_OUT = 'REQUEST_GOOGLE_SIGN_OUT';
export const requestGoogleSignOut = createAction(REQUEST_GOOGLE_SIGN_OUT);
export const SUCCESS_GOOGLE_SIGN_OUT = 'SUCCESS_GOOGLE_SIGN_OUT';
export const successGoogleSignOut = createAction(SUCCESS_GOOGLE_SIGN_OUT);