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
  requestRetrieveGoogleUser,
  requestReadGoogleSheetInfo,
} from '../actions/phrases';

const mapStateToProps = ({ phrases }, ownProps) => {
  return { phrases };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onPressSwipeCompleteButton: () => {
      dispatch(requestCompletePhrase());
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
    onAfterRefreshPhrases: () => {
      dispatch(requestImportPhrases());
    },
    onRetrieveGoogleUser: (payload) => {
      dispatch(requestRetrieveGoogleUser(payload));
    },
    onReadGoogleSheetInfo: (payload) => {
      dispatch(requestReadGoogleSheetInfo(payload));
    },
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Phrases);
