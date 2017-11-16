import ReportResponse from '../../components/ReportResponse'
import { connect } from 'react-redux'

import {
  requestCreateGoodResponse,
  requestDestroyGoodResponse,
  requestShowReport,
} from '../../actions'

function mapStateToProps({ auth, reports }) {
  return { auth, reports }
}

function mapDispatchToProps(dispatch) {
  return {
    createGood: (payload) => {
      dispatch(requestCreateGoodResponse(payload))
    },
    destroyGood: (payload) => {
      dispatch(requestDestroyGoodResponse(payload))
    },
    handleShowReport: (payload) => {
      dispatch(requestShowReport(payload))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReportResponse)
