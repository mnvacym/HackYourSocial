import axios from 'axios';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_PROFILE,
  VERIFY_ACCOUNT,
  USER_NOT_VERIFIED,
  PASSWORD_RESET_CLEAR,
  PASSWORD_RESET_HASH_CREATED,
  PASSWORD_RESET_HASH_FAILURE,
  PASSWORD_SAVE_CLEAR,
  PASSWORD_SAVE_SUCCESS,
  PASSWORD_SAVE_FAILURE,
} from './types';
import { setAlert } from './alert';
import setAuthToken from '../utils/setAuthToken';

// Load User
export const loadUser = () => async dispatch => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }
  try {
    const res = await axios.get('/api/auth');

    if (res.data.isVerified) {
      dispatch({
        type: USER_LOADED,
        payload: res.data,
      });
    } else {
      dispatch({
        type: USER_NOT_VERIFIED,
        payload: {
          isVerified: res.data.isVerified,
          email: res.data.email,
        },
      });
    }
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

// Register User
export const register = ({ name, email, password }) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ name, email, password });

  try {
    const res = await axios.post('/api/users', body, config);

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data,
    });

    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: REGISTER_FAIL,
    });
  }
};

// Login User
export const login = (email, password) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ email, password });

  try {
    const res = await axios.post('/api/auth', body, config);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });

    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: LOGIN_FAIL,
    });
  }
};

// Logout User / Clear Profile
export const logout = () => dispatch => {
  dispatch({ type: CLEAR_PROFILE });
  dispatch({ type: LOGOUT });
};

// Verify Account
export const verifyAccount = verifyToken => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ verifyToken });

  try {
    const res = await axios.post('/api/users/verify', body, config);

    dispatch({
      type: VERIFY_ACCOUNT,
      payload: res.data,
    });

    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }
  }
};

// Send email to API for hashing
export const createHash = email => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ email });

  try {
    await axios.post('/api/auth/saveresethash', body, config);

    dispatch({
      type: PASSWORD_RESET_HASH_CREATED,
    });
  } catch (err) {
    console.error(err);
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    console.log(err);
    dispatch({
      type: PASSWORD_RESET_HASH_FAILURE,
    });
  }
};

export const passwordResetClear = () => dispatch => {
  dispatch({
    type: PASSWORD_RESET_CLEAR,
  });
};

// Save a user's password
export const savePassword = data => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify(data);

  try {
    await axios.post('/api/auth/savepassword', body, config);

    dispatch({ type: PASSWORD_SAVE_SUCCESS });
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: PASSWORD_SAVE_FAILURE,
    });
  }
};

export const passwordSaveClear = () => dispatch => {
  dispatch({
    type: PASSWORD_SAVE_CLEAR,
  });
};
