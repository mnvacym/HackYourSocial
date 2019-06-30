import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { createHash, passwordResetClear } from '../../actions/auth';
import PropTypes from 'prop-types';

const ResetPasswordPage = ({ isPasswordReset, createHash, passwordResetClear }) => {
  const [formData, setFormData] = useState({
    email: '',
  });

  const { email } = formData;

  useEffect(() => {
    if (isPasswordReset) {
      setFormData({ ...formData, email: '' });
    }
  }, [setFormData]);

  const clearPasswordReset = e => {
    e.preventDefault();
    passwordResetClear();
  };

  const handleEmailChange = e => {
    setFormData({ ...formData, email: e.target.value });
  };

  const onSubmit = e => {
    e.preventDefault();
    createHash(email);
  };

  return (
    <Fragment>
      {isPasswordReset ? (
        <Fragment>
          <div className="row justify-content-center">
            <div className="col-10 col-sm-7 col-md-5 col-lg-4">
              <p>
                An email has been sent to email address you provided containing a link to reset your
                password. Please click on that link to proceed with setting a new password.
              </p>
              <br />

              <p>And please check your spam box.</p>
              <p>
                <a href="/auth/reset-password" onClick={() => clearPasswordReset()}>
                  Re-send Email
                </a>
              </p>
            </div>
          </div>
        </Fragment>
      ) : (
        <Fragment>
          <p>
            If you want to reset your password, please enter your email here and a link will be sent
            to your email address to reset your password.
          </p>
          <form className="form" onSubmit={e => onSubmit(e)}>
            <div className="form-group">
              <input
                id="userEmail"
                name="email"
                onChange={e => handleEmailChange(e)}
                placeholder="Please enter your email here."
                required
                type="email"
                value={email}
              />
            </div>

            <p className="lead">A valid email is required to reset your password</p>
            <input type="submit" className="btn btn-primary" value="Reset Password" />
          </form>
        </Fragment>
      )}
    </Fragment>
  );
};

ResetPasswordPage.propTypes = {
  isPasswordReset: PropTypes.bool,
};

const mapStateToProps = state => ({
  isPasswordReset: state.auth.isPasswordReset,
});

export default connect(
  mapStateToProps,
  { createHash, passwordResetClear }
)(ResetPasswordPage);
