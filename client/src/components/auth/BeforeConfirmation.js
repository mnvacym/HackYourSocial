import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import axios from 'axios';
import PropTypes from 'prop-types';

const BeforeConfirmation = ({ email, isVerified }) => {
  const onClick = async () => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const body = JSON.stringify({ email });
    await axios.post('/api/users/resendconfirmation', body, config);
  };

  if (isVerified) {
    return <Redirect to="/dashboard" />;
  }

  console.clear();

  return (
    <Fragment>
      <h1 className="large text-primary">Please verify your account</h1>
      <p className="lead">
        We sent you an email which contains a verification link. Please click on the link to verify
        your account. Thank you.
      </p>
      <p className="my-1">Do not forget to check your spam box.</p>

      <button className="btn btn-primary" onClick={onClick}>
        Resend Verification Email
      </button>
      <p className="my-1">Hack Your Social Team.</p>
    </Fragment>
  );
};

BeforeConfirmation.propTypes = {
  email: PropTypes.string.isRequired,
  isVerified: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  email: state.auth.email,
  isVerified: state.auth.isVerified,
});

export default connect(mapStateToProps)(BeforeConfirmation);
