import PropTypes from 'prop-types';
import { createContext, useEffect, useReducer, useCallback } from 'react';
import { Auth0Client } from '@auth0/auth0-spa-js';
// routes
import { PATH_AUTH } from '../routes/paths';
// config
import { AUTH0_API } from '../config';

// ----------------------------------------------------------------------

// NOTE:
// We only build demo at basic level.
// Customer will need to do some extra handling yourself if you want to extend the logic and other features...

// ----------------------------------------------------------------------

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
  if (action.type === 'LOGOUT') {
    return {
      ...state,
      isAuthenticated: false,
      user: null,
    };
  }

  return state;
};

// ----------------------------------------------------------------------

export const AuthContext = createContext(null);

// ----------------------------------------------------------------------

let auth0Client = null;

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = useCallback(async () => {
    try {
      auth0Client = new Auth0Client({
        client_id: AUTH0_API.clientId || '',
        domain: AUTH0_API.domain || '',
        redirect_uri: window.location.origin,
      });

      await auth0Client.checkSession();

      const isAuthenticated = await auth0Client.isAuthenticated();

      if (isAuthenticated) {
        const user = await auth0Client.getUser();

        dispatch({
          type: 'INITIAL',
          payload: {
            isAuthenticated,
            user: {
              ...user,
              displayName: user?.name,
              photoURL: user?.picture,
              role: 'admin',
            },
          },
        });
      } else {
        dispatch({
          type: 'INITIAL',
          payload: {
            isAuthenticated,
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
  const login = async () => {
    await auth0Client?.loginWithPopup();

    const isAuthenticated = await auth0Client?.isAuthenticated();

    if (isAuthenticated) {
      const user = await auth0Client?.getUser();

      dispatch({
        type: 'LOGIN',
        payload: {
          user: {
            ...user,
            displayName: user?.name,
            photoURL: user?.picture,
            role: 'admin',
          },
        },
      });
    }
  };

  // LOGOUT
  const logout = () => {
    auth0Client?.logout();
    window.location.href = PATH_AUTH.login;
    dispatch({
      type: 'LOGOUT',
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'auth0',
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
