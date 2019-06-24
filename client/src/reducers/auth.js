import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  ACCOUNT_DELETED,
} from '../actions/types';

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  loading: true,
  user: null,
  isPasswordReset: false, // new code
  isPasswordChanged: false, // new code
};

export default function(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload,
      };
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      localStorage.setItem('token', payload.token);
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false,
      };
    case REGISTER_FAIL:
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case LOGOUT:
    case ACCOUNT_DELETED:
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
      };
    case 'AUTHENTICATION_PASSWORD_RESET_CLEAR': // new code
    case 'AUTHENTICATION_PASSWORD_RESET_HASH_FAILURE': {
      const newState = Object.assign({}, state);
      newState.isPasswordReset = false;
      return newState;
    }
    case 'AUTHENTICATION_PASSWORD_RESET_HASH_CREATED': {
      const newState = Object.assign({}, state);
      newState.isPasswordReset = true;
      return newState;
    }
    case 'AUTHENTICATION_PASSWORD_SAVE_CLEAR': {
      const newState = Object.assign({}, state);
      newState.isPasswordChanged = false;
      return newState;
    }
    case 'AUTHENTICATION_PASSWORD_SAVE_SUCCESS': {
      const newState = Object.assign({}, state);
      newState.isPasswordChanged = true;
      return newState;
    }
    default:
      return state;
  }
}
