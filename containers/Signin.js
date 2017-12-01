import Signin from '../components/Signin';
import { connect } from 'react-redux';

import {
  requestGoogleSignIn,
  requestGoogleSignOut,
} from '../actions';

const mapStateToProps = ({ signin, phrases }, ownProps) => {
  return { signin, phrases };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onPressSignIn: () => {
      dispatch(requestGoogleSignIn());
    },
    onPressSignOut: () => {
      dispatch(requestGoogleSignOut());
    },
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Signin);
