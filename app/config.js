import Secret from './secret';

const Config = {
  googleSignin: {
    scopes: [
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/drive.readonly',
    ],
    iosClientId: Secret.googleSignin.iosClientId,
    webClientId: Secret.googleSignin.webClientId,
  },
  googleAPI: {
    sheetsEndpoint: 'https://sheets.googleapis.com/v4/spreadsheets',
  }
};

export default Config;