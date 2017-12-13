import SettingsListChild from '../components/SettingsListChild';
import { connect } from 'react-redux';

const mapStateToProps = ({ signin, phrases, settingsListChild }, ownProps) => {
  return { signin, phrases, settingsListChild };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingsListChild);