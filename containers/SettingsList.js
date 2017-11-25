import SettingsList from '../components/SettingsList';
import { connect } from 'react-redux';

const mapStateToProps = ({ signin, phrases }, ownProps) => {
  return { signin, phrases };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingsList);
