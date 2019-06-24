import React from 'react';
import { connect } from 'react-redux';
import { createHash, passwordResetClear } from '../../actions/auth';

import ResetPasswordPage from './ResetPasswordPage';

export class ResetPasswordPageContainer extends React.Component {
  constructor(props) {
    super(props);

    // bound functions
    this.clearPasswordResetFunction = this.clearPasswordResetFunction.bind(this);
    this.resetPasswordRequest = this.resetPasswordRequest.bind(this);
  }

  clearPasswordResetFunction() {
    const { dispatch } = this.props;
    dispatch(passwordResetClear());
  }

  resetPasswordRequest(email) {
    const { dispatch } = this.props;
    dispatch(createHash(email));
  }

  render() {
    const { isPasswordReset } = this.props.auth;
    return (
      <ResetPasswordPage
        clearPasswordResetFunction={this.clearPasswordResetFunction}
        isPasswordReset={isPasswordReset}
        resetPasswordFunction={this.resetPasswordRequest}
      />
    );
  }
}

const mapStateToProps = state => ({ auth: state.auth });

export default connect(mapStateToProps)(ResetPasswordPageContainer);
