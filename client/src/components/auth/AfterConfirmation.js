import React, { Fragment, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { register, verifyAccount } from '../../actions/auth';

const AfterConfirmation = ({ verifyAccount, match }) => {
  useEffect(() => {
    verifyAccount(match.params.token);
  }, [verifyAccount]);

  return (
    <Fragment>
      <h1 className='large text-primary'>Verification</h1>
      <p className='lead'>
        Your account is verified. You can go to your dashboard by clicking this{' '}
        <Link to='/dashboard'>link</Link>.
      </p>

      <p className='my-1'>Have a nice networking! Thank you.</p>
      <p className='my-1'>Hack Your Social Team.</p>
    </Fragment>
  );
};

AfterConfirmation.propTypes = {
  verifyAccount: PropTypes.func.isRequired,
};

export default connect(
  null,
  { register, verifyAccount }
)(withRouter(AfterConfirmation));
