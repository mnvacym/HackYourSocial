import {
  REGISTER_SUCCESS,
  SOCIAL_REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  ACCOUNT_DELETED,
  VERIFY_ACCOUNT,
  USER_NOT_VERIFIED,
  PASSWORD_RESET_CLEAR,
  PASSWORD_RESET_HASH_CREATED,
  PASSWORD_RESET_HASH_FAILURE,
  PASSWORD_SAVE_CLEAR,
  PASSWORD_SAVE_SUCCESS,
  PASSWORD_SAVE_FAILURE,
} from '../actions/types';

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  loading: true,
  user: null,
  isVerified: false,
  email: '',
  isPasswordReset: false,
  isPasswordChanged: false,
  socialProfile: null,
};

export default function(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case USER_LOADED:
      return {
        ...state,
        isVerified: true,
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
    case SOCIAL_REGISTER_SUCCESS:
      localStorage.setItem('token', payload);
      return {
        ...state,
        payload,
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
    case VERIFY_ACCOUNT:
      return {
        ...state,
        isVerified: true,
        loading: false,
      };
    case USER_NOT_VERIFIED:
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false,
      };
    case PASSWORD_RESET_CLEAR:
    case PASSWORD_RESET_HASH_FAILURE:
      return {
        ...state,
        isPasswordReset: false,
      };
    case PASSWORD_RESET_HASH_CREATED:
      return {
        ...state,
        isPasswordReset: true,
      };
    case PASSWORD_SAVE_CLEAR:
    case PASSWORD_SAVE_FAILURE:
      return {
        ...state,
        isPasswordChanged: false,
      };
    case PASSWORD_SAVE_SUCCESS:
      return {
        ...state,
        isPasswordChanged: true,
      };
    default:
      return state;
  }
}
