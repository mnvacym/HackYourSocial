import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { setAlert } from '../../actions/alert';
import { register, socialRegister } from '../../actions/auth';
import PropTypes from 'prop-types';
import { GoogleLogin } from 'react-google-login';

const Register = ({ setAlert, register, isAuthenticated, socialProfile }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
    redirectToReferrer: false,
  });

  const signup = (res, type) => {
    socialRegister(res);
  };

  const responseGoogle = response => {
    console.log(response);
    signup(response.profileObj, 'google');
  };

  const { name, email, password, password2, redirectToReferrer } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    if (password !== password2) {
      setAlert('Passwords do not match!', 'danger');
    } else {
      register({ name, email, password });
    }
  };

  if (isAuthenticated) {
    return <Redirect to='/dashboard' />;
  }

  if (redirectToReferrer) {
    return <Redirect to='/dashboard' />;
  }

  return (
    <Fragment>
      <h1 className='large text-primary'>Sign Up</h1>
      <p className='lead'>
        <i className='fas fa-user' /> Create Your Account
      </p>
      <form className='form' onSubmit={e => onSubmit(e)}>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Name'
            name='name'
            value={name}
            onChange={e => onChange(e)}
            // required
          />
        </div>
        <div className='form-group'>
          <input
            type='email'
            placeholder='Email Address'
            name='email'
            value={email}
            onChange={e => onChange(e)}
            // required
          />
          <small className='form-text'>
            This site uses Gravatar so if you want a profile image, use a Gravatar email
          </small>
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Password'
            name='password'
            // minLength="6"
            value={password}
            onChange={e => onChange(e)}
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Confirm Password'
            name='password2'
            // minLength="6"
            value={password2}
            onChange={e => onChange(e)}
          />
        </div>
        <input type='submit' className='btn btn-primary' value='Register' />
      </form>
      {
        // Sign up with social account - buttons
      }
      <GoogleLogin
        clientId='18346263600-ls8p9q7atre6ahrbrl4kpcomioas4m35.apps.googleusercontent.com'
        secret='MzEDBVxVDqA32wNkptlR2Wtt'
        buttonText='Login with Google'
        theme='dark'
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        cookiePolicy={'single_host_origin'}
      />
      <p className='my-1'>
        Already have an account? <Link to='/login'>Sign In</Link>
      </p>
    </Fragment>
  );
};

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  socialProfile: state.auth.socialProfile,
});

export default connect(
  mapStateToProps,
  // this helps us to reach setAlert within props
  { setAlert, register, socialRegister },
)(Register);
