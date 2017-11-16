import Phrases from '../components/Phrases';
import { connect } from 'react-redux';

import {
  requestCompletePhrase,
} from '../actions/phrases';

const mapStateToProps = (state, ownProps) => {
  return state;
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    completePhrase: (payload) => {
      dispatch(requestCompletePhrase(payload));
    },
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Phrases);
