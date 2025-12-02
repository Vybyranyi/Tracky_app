import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const getInitialToken = () => {
  return localStorage.getItem('token') || sessionStorage.getItem('token') || '';
};

const getInitialRole = () => {
  return localStorage.getItem('userRole') || sessionStorage.getItem('userRole') || '';
};

const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch {
    return true;
  }
};

const initialToken = getInitialToken();
const initialRole = getInitialRole();
const tokenValid = initialToken && !isTokenExpired(initialToken);

if (initialToken && !tokenValid) {
  localStorage.removeItem('token');
  sessionStorage.removeItem('token');
  localStorage.removeItem('userRole');
  sessionStorage.removeItem('userRole');
}

const initialState = {
  isAuth: tokenValid,
  token: tokenValid ? initialToken : '',
  userRole: tokenValid ? initialRole : '',
  userProfile: null,
  error: null
};

export const signInAsync = createAsyncThunk(
  'auth/signin',
  async ({ email, password, rememberMe }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/signin`, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await res.json();

      if (!res.ok) {
        return rejectWithValue(data.message || 'Invalid credentials');
      }

      const role = data.role || (data.user && data.user.role) || 'user';

      if (rememberMe) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userRole', role);
      } else {
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('userRole', role);
      }

      return { token: data.token, role };
    } catch (err) {
      return rejectWithValue(err.message || 'Network error');
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const res = await fetch(`${API_URL}/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) {
        const data = await res.json();
        return rejectWithValue(data.message || 'Failed to fetch profile');
      }

      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message || 'Network error');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuth = false;
      state.token = '';
      state.userRole = '';
      state.userProfile = null;
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      localStorage.removeItem('userRole');
      sessionStorage.removeItem('userRole');
    },
    setAuth: (state, action) => {
      state.isAuth = true;
      state.token = action.payload.token;
      state.userRole = action.payload.role || getInitialRole();
    },
    checkToken: (state) => {
      if (state.token && isTokenExpired(state.token)) {
        state.isAuth = false;
        state.token = '';
        state.userRole = '';
        state.userProfile = null;
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        localStorage.removeItem('userRole');
        sessionStorage.removeItem('userRole');
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(signInAsync.fulfilled, (state, action) => {
        state.isAuth = true;
        state.token = action.payload.token;
        state.userRole = action.payload.role;
        state.error = null;
      })
      .addCase(signInAsync.rejected, (state, action) => {
        state.isAuth = false;
        state.token = '';
        state.userRole = '';
        state.userProfile = null;
        state.error = action.payload || 'Login failed';
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.userProfile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        console.error('Failed to fetch profile:', action.payload);
      });
  }
});

export const { logout, setAuth, checkToken } = authSlice.actions;
export default authSlice.reducer;