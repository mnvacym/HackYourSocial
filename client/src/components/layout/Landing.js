import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const Landing = ({ isAuthenticated }) => {
  if (isAuthenticated) {
    return <Redirect to='/dashboard' />;
  }

  return (
    <section className='landing'>
      <div className='dark-overlay'>
        <div className='landing-inner'>
          <h1 className='x-large'>Developer Connector</h1>
          <p className='lead'>
            Create a developer profile/portfolio, share posts and get help from other developers
          </p>
          <div className='buttons'>
            <Link to='/register' className='btn btn-primary'>
              Sign Up
            </Link>
            <Link to='/login' className='btn btn-light'>
              Login
            </Link>
            <h4 className='or'>or sign in with social</h4>
            <div className='social-buttons'>
              {/* Google sign in button */}
              <a
                href='http://localhost:5000/api/auth/social/google'
                className='social-button google'
              >
                <div>
                  <span className='svgIcon'>
                    <svg width='25' height='37' viewBox='0 0 25 25'>
                      <g fill='none'>
                        <path
                          d='M20.66 12.693c0-.603-.054-1.182-.155-1.738H12.5v3.287h4.575a3.91 3.91 0 0 1-1.697 2.566v2.133h2.747c1.608-1.48 2.535-3.65 2.535-6.24z'
                          fill='#4285F4'
                        />
                        <path
                          d='M12.5 21c2.295 0 4.22-.76 5.625-2.06l-2.747-2.132c-.76.51-1.734.81-2.878.81-2.214 0-4.088-1.494-4.756-3.503h-2.84v2.202A8.498 8.498 0 0 0 12.5 21z'
                          fill='#34A853'
                        />
                        <path
                          d='M7.744 14.115c-.17-.51-.267-1.055-.267-1.615s.097-1.105.267-1.615V8.683h-2.84A8.488 8.488 0 0 0 4 12.5c0 1.372.328 2.67.904 3.817l2.84-2.202z'
                          fill='#FBBC05'
                        />
                        <path
                          d='M12.5 7.38c1.248 0 2.368.43 3.25 1.272l2.437-2.438C16.715 4.842 14.79 4 12.5 4a8.497 8.497 0 0 0-7.596 4.683l2.84 2.202c.668-2.01 2.542-3.504 4.756-3.504z'
                          fill='#EA4335'
                        />
                      </g>
                    </svg>
                  </span>
                  <span className='button-label'>Sign in with Google</span>
                </div>
              </a>
              {/* Github sign in button */}
              <a
                href='http://localhost:5000/api/auth/social/github'
                className='social-button github'
              >
                <div className='github-button-content'>
                  <span className='svgIcon'>
                    <img
                      className='github-icon'
                      src={require('./github-logo.svg')}
                      height='20'
                      alt=''
                    />
                    <span className='sign-in-social-button'>Sign in with Github</span>
                  </span>
                  <span className='button-label' />
                </div>
              </a>
              {/* Facebook sign in button */}
              <a
                href='http://localhost:5000/api/auth/social/facebook'
                className='social-button facebook'
              >
                <div>
                  <span className='svgIcon'>
                    <img
                      className='facebook-icon'
                      src={require('./facebook.svg')}
                      height='20'
                      alt=''
                    />
                    <span className='sign-in-social-button'>Sign in with Facebook</span>
                  </span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

Landing.propTypes = {
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(Landing);
