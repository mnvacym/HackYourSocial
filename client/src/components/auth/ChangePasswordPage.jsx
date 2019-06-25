import React, { Fragment, useState, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { passwordSaveClear, savePassword } from '../../actions/auth';
import PropTypes from 'prop-types';
import { setAlert } from '../../actions/alert';

const ChangePasswordPage = ({
  setAlert,
  passwordSaveClear,
  savePassword,
  isPasswordChanged,
  isAuthenticated,
  match,
}) => {
  const [formData, setFormData] = useState({
    password: '',
    password2: '',
  });

  const { password, password2 } = formData;

  useEffect(() => {
    passwordSaveClear();
  }, [passwordSaveClear]);

  const sendPassword = password => {
    const data = {
      hash: match.params.hash,
      password,
    };
    savePassword(data);
  };

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    if (password !== password2) {
      setAlert('Passwords do not match!', 'danger');
    } else {
      sendPassword(password);
    }
  };

  // If they just changed a password and AREN'T logged in
  if (isPasswordChanged && !isAuthenticated) {
    return (
      <div className="row justify-content-center">
        <div className="col-10 col-sm-7 col-md-5 col-lg-4">
          <p>
            Your changes have been saved, and you can now <Link to="/login">log in</Link> with the
            new password.
          </p>
        </div>
      </div>
    );
  }

  // If they just changed a password and ARE logged in
  if (isPasswordChanged && isAuthenticated) {
    return (
      <div className="row justify-content-center">
        <div className="col-10 col-sm-7 col-md-5 col-lg-4">
          <p>Your new password has been saved.</p>
        </div>
      </div>
    );
  }

  return (
    <Fragment>
      <p className="lead"> Please enter new password below</p>

      <form className="form" onSubmit={e => onSubmit(e)}>
        <div className="form-group">
          <input
            minLength="6"
            name="password"
            onChange={e => onChange(e)}
            placeholder="Password"
            required
            type="password"
            value={password}
          />
        </div>
        <div className="form-group">
          <input
            minLength="6"
            name="password2"
            onChange={e => onChange(e)}
            placeholder="Confirm password"
            required
            type="password"
            value={password2}
          />
        </div>

        <input type="submit" className="btn btn-primary" value="Change Password" />
      </form>
    </Fragment>
  );
};

ChangePasswordPage.propTypes = {
  isPasswordChanged: PropTypes.bool,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = state => ({
  isPasswordChanged: state.auth.isPasswordChanged,
  isAuthenticated: state.auth.isLoggedIn,
});

export default connect(
  mapStateToProps,
  { setAlert, passwordSaveClear, savePassword }
)(withRouter(ChangePasswordPage));
