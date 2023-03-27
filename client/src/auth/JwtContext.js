import PropTypes from 'prop-types';
import { createContext, useEffect, useReducer, useCallback } from 'react';
import axios from '../utils/axios';
import { isValidToken, jwtDecode, setSession } from './utils';

const initialState = {
  isInitialized: false,
  isAuthenticated: false,
  user: null,
};

const reducer = (state, action) => {
  if (action.type === 'INITIAL') {
    return {
      isInitialized: true,
      isAuthenticated: action.payload.isAuthenticated,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGIN') {
    return {
      ...state,
      isAuthenticated: true,
      user: action.payload.user,
    };
  }
  if (action.type === 'REGISTER') {
    return {
      ...state,
      isAuthenticated: true,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGOUT') {
    return {
      ...state,
      isAuthenticated: false,
      user: null,
    };
  }

  return state;
};

export const AuthContext = createContext(null);

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = useCallback(async () => {
    try {
      const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : '';

      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken);

        const user = jwtDecode(accessToken)

        dispatch({
          type: 'INITIAL',
          payload: {
            isAuthenticated: true,
            user,
          },
        });
      } else {
        dispatch({
          type: 'INITIAL',
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: 'INITIAL',
        payload: {
          isAuthenticated: false,
          user: null,
        },
      });
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN
  const login = async (email, password) => {
    const response = await axios.post('/login', {
      email,
      password,
    });
    const { accessToken, user } = response.data;

    setSession(accessToken);

    dispatch({
      type: 'LOGIN',
      payload: {
        user,
      },
    });
  };

  // LOGOUT
  const logout = async () => {
    setSession(null);
    dispatch({
      type: 'LOGOUT',
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'jwt',
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
