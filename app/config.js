import Secret from './secret';

const Config = {
  googleSignin: {
    iosClientId: Secret.googleSignin.iosClientId,
  },
  googleAPI: {
    scopes: [
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/drive.readonly',
    ],
    sheetsEndpoint: 'https://sheets.googleapis.com/v4/spreadsheets',
  }
};

export default Config;