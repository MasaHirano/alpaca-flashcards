import Signin from '../components/Signin';
import { connect } from 'react-redux';
import _ from 'lodash';

import {
  // requestCompletePhrase,
  requestGoogleSignIn,
} from '../actions';

const mapStateToProps = ({ signin, phrases }, ownProps) => {
  return { signin, phrases };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onPressSignIn: () => {
      dispatch(requestGoogleSignIn());
    },
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Signin);
