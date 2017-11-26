import SettingsList from '../components/SettingsList';
import { connect } from 'react-redux';

import {
  requestRetrieveGoogleFiles,
  requestSelectGoogleFile,
  requestRetrieveGoogleSheets,
  requestSelectGoogleSheet,
} from '../actions';

const mapStateToProps = ({ signin, phrases }, ownProps) => {
  return { signin, phrases };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onDidMountFilesView: () => {
      dispatch(requestRetrieveGoogleFiles());
    },
    onPressFileListRow: (payload) => {
      dispatch(requestSelectGoogleFile(payload));
    },
    onDidMountSheetsView: () => {
      dispatch(requestRetrieveGoogleSheets());
    },
    onPressSheetsListRow: (payload) => {
      dispatch(requestSelectGoogleSheet(payload));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingsList);
