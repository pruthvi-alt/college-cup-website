import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null
};

// Action types
const actionTypes = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  REGISTER_START: 'REGISTER_START',
  REGISTER_SUCCESS: 'REGISTER_SUCCESS',
  REGISTER_FAILURE: 'REGISTER_FAILURE',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_LOADING: 'SET_LOADING'
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.LOGIN_START:
    case actionTypes.REGISTER_START:
      return {
        ...state,
        loading: true,
        error: null
      };

    case actionTypes.LOGIN_SUCCESS:
    case actionTypes.REGISTER_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        loading: false,
        error: null
      };

    case actionTypes.LOGIN_FAILURE:
    case actionTypes.REGISTER_FAILURE:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload.error
      };

    case actionTypes.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null
      };

    case actionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    case actionTypes.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };

    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Auth Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check if user is logged in on app startup
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');

      if (token && user) {
        try {
          const parsedUser = JSON.parse(user);
          dispatch({
            type: actionTypes.LOGIN_SUCCESS,
            payload: { user: parsedUser }
          });
        } catch (error) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      
      dispatch({ type: actionTypes.SET_LOADING, payload: false });
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (email, password) => {
    dispatch({ type: actionTypes.LOGIN_START });

    try {
      // For now, we'll simulate a login process
      // In a real app, this would make an API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay

      // Mock user data - replace with actual API call
      if (email === 'admin@college.edu' && password === 'admin123') {
        const user = {
          id: 1,
          name: 'Admin User',
          email: 'admin@college.edu',
          role: 'admin'
        };

        const token = 'mock-jwt-token-' + Date.now();

        // Store in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        dispatch({
          type: actionTypes.LOGIN_SUCCESS,
          payload: { user }
        });

        return { success: true };
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      dispatch({
        type: actionTypes.LOGIN_FAILURE,
        payload: { error: error.message }
      });
      return { success: false, error: error.message };
    }
  };

  // Register function
  const register = async (userData) => {
    dispatch({ type: actionTypes.REGISTER_START });

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock registration - replace with actual API call
      const user = {
        id: Date.now(),
        name: userData.name,
        email: userData.email,
        role: 'user'
      };

      const token = 'mock-jwt-token-' + Date.now();

      // Store in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      dispatch({
        type: actionTypes.REGISTER_SUCCESS,
        payload: { user }
      });

      return { success: true };
    } catch (error) {
      dispatch({
        type: actionTypes.REGISTER_FAILURE,
        payload: { error: error.message }
      });
      return { success: false, error: error.message };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: actionTypes.LOGOUT });
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: actionTypes.CLEAR_ERROR });
  };

  // Context value
  const value = {
    ...state,
    login,
    register,
    logout,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
