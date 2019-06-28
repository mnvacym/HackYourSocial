import React, { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { register, verifyAccount } from '../../actions/auth';

const Confirmation = ({ verifyAccount }) => {
  useEffect(() => {
    verifyAccount();
  }, [verifyAccount]);

  return (
    <Fragment>
      <h1 className="large text-primary">Verification</h1>
      <p className="lead">
        Your account is verified. You can go to your dashboard by clicking this{' '}
        <a href="/dashboard">link</a>.
      </p>

      <p className="my-1">Have a nice networking! Thank you.</p>
      <p className="my-1">Hack Your Social Team.</p>
    </Fragment>
  );
};

Confirmation.propTypes = {
  verifyAccount: PropTypes.func.isRequired,
};

export default connect(
  null,
  { register, verifyAccount }
)(Confirmation);
