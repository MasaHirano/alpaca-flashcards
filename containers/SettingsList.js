import SettingsList from '../components/SettingsList';
import { connect } from 'react-redux';
import _ from 'lodash';

import {
  // requestGoogleSignIn,
  // requestGoogleSignOut,
} from '../actions';

const mapStateToProps = ({ signin, phrases }, ownProps) => {
  console.log('SettingsList.mapStateToProps', signin, phrases);
  return { signin, phrases };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    // onPressSignIn: () => {
    //   dispatch(requestGoogleSignIn());
    // },
    // onPressSignOut: () => {
    //   dispatch(requestGoogleSignOut());
    // },
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingsList);
