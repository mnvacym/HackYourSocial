import React, { Fragment } from 'react';
import { connect } from 'react-redux';

const Confirmation = () => {
  return (
    <Fragment>
      <h1 className="large text-primary">Please verify your account</h1>
      <p className="lead">
        We sent you an email which contains a verification link. Please click on the link to verify
        your account. Thank you.
      </p>
      <p className="my-1">Do not forget to check your spam box.</p>

      <p className="my-1">Hack Your Social Team.</p>
    </Fragment>
  );
};

export default connect()(Confirmation);
