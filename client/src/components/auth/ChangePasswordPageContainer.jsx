import React from 'react';
import { connect } from 'react-redux';
import { passwordSaveClear, savePassword } from '../../actions/auth';

import ChangePasswordPage from './ChangePasswordPage';

export class ChangePasswordPageContainer extends React.Component {
  constructor(props) {
    super(props);

    // bound functions
    this.sendPassword = this.sendPassword.bind(this);
  }

  // Clear password changed state on unmount
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(passwordSaveClear());
  }

  sendPassword(password) {
    const { dispatch } = this.props;
    const data = {
      hash: this.props.match.params.hash,
      password,
    };
    dispatch(savePassword(data));
  }

  render() {
    const { auth } = this.props;
    return (
      <ChangePasswordPage
        auth={auth}
        sendPasswordFunction={this.sendPassword}
      />
    );
  }
}

const mapStateToProps = state => ({ auth: state.auth });

export default connect(mapStateToProps)(ChangePasswordPageContainer);
