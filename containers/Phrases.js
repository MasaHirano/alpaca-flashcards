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
  requestUpdateGoogleSheet,
} from '../actions/phrases';

const mapStateToProps = ({ phrases, signin }, ownProps) => {
  return { phrases, signin };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onPressSwipeCompleteButton: () => {
      dispatch(requestCompletePhrase());
    },
    onPressArchiveIcon: () => {
      dispatch(requestArchivePickups());
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
    onUpdateGoogleSheet: () => {
      dispatch(requestUpdateGoogleSheet());
    },
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Phrases);
