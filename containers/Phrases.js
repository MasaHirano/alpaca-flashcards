import Phrases from '../components/Phrases';
import { connect } from 'react-redux';
import _ from 'lodash';

import {
  requestCompletePhrase,
  requestArchivePickups,
  requestShowPhrase,
  requestCloseModal,
  requestRefreshPhrases,
  requestImportPhrases,
} from '../actions/phrases';

const mapStateToProps = ({ phrases }, ownProps) => {
  return { phrases };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onPressSwipeCompleteButton: (payload) => {
      dispatch(requestCompletePhrase(payload));
    },
    onPressArchiveIcon: (payload) => {
      dispatch(requestArchivePickups(payload));
    },
    onPressPhraseList: (payload) => {
      dispatch(requestShowPhrase(payload));
    },
    onPressModal: () => {
      dispatch(requestCloseModal());
    },
    onRefreshPhrases: () => {
      dispatch(requestRefreshPhrases());
    },
    onAfterRefreshPhrases: (payload) => {
      dispatch(requestImportPhrases(payload));
    },
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Phrases);
