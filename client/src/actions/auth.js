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

    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
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


// here the new code 
export const passwordResetHashCreated = () => ({ type: 'AUTHENTICATION_PASSWORD_RESET_HASH_CREATED' });
export const passwordResetHashFailure = error => ({ type: 'AUTHENTICATION_PASSWORD_RESET_HASH_FAILURE', error });

// Send email to API for hashing
export function createHash(email) {
  return async (dispatch) => {

    // contact the API
    await fetch(
      // where to contact
      '/api/auth/saveresethash',
      // what to send
      {
        method: 'POST',
        body: JSON.stringify({ email }),
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
      },
    )
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        return null;
      })
      .then((json) => {
        if (json.success) {
          return dispatch(passwordResetHashCreated(json));
        }
        return dispatch(passwordResetHashFailure(new Error('Something went wrong. Please try again.')));
      })
      .catch(error => dispatch(passwordResetHashFailure(error)));

  };
}

export const passwordResetClear = () => ({ type: 'AUTHENTICATION_PASSWORD_RESET_CLEAR' });

export const passwordSaveFailure = error => ({ type: 'AUTHENTICATION_PASSWORD_SAVE_FAILURE', error });
export const passwordSaveSuccess = () => ({ type: 'AUTHENTICATION_PASSWORD_SAVE_SUCCESS' });


// Save a user's password
export function savePassword(data) {
  return async (dispatch) => {

    // contact the API
    await fetch(
      // where to contact
      '/api/auth/savepassword',
      // what to send
      {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
      },
    )
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        return null;
      })
      .then(async (json) => {
        if (json && json.success) {
          dispatch(passwordSaveSuccess());
        } else {
          dispatch(passwordSaveFailure(new Error(json.error.message ? 'There was an error saving the password. Please try again' : json.error)));
        }
      })
      .catch((error) => {
        dispatch(passwordSaveFailure(new Error(error.message || 'There was an error saving the password. Please try again.')));
      });

  };
}

export const passwordSaveClear = () => ({ type: 'AUTHENTICATION_PASSWORD_SAVE_CLEAR' });
