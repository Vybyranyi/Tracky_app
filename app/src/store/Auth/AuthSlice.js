import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const API_URL = import.meta.env.VITE_API_URL || 'https://tracky-server.onrender.com';

const getInitialToken = () => {
  return localStorage.getItem('token') || sessionStorage.getItem('token') || '';
};

// Перевіряємо чи токен не закінчився
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
const tokenValid = initialToken && !isTokenExpired(initialToken);

// Якщо токен закінчився - очищаємо сховище
if (initialToken && !tokenValid) {
  localStorage.removeItem('token');
  sessionStorage.removeItem('token');
}

const initialState = {
  isAuth: tokenValid,
  token: tokenValid ? initialToken : '',
  error: null
};

export const signInAsync = createAsyncThunk(
  'auth/signin',
  async ({ username, password, rememberMe }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/signin`, {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await res.json();

      if (!res.ok) {
        return rejectWithValue(data.message || 'Invalid credentials');
      }

      if (rememberMe) {
        localStorage.setItem('token', data.token);
      } else {
        sessionStorage.setItem('token', data.token);
      }

      return { token: data.token };
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
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
    },
    setAuth: (state, action) => {
      state.isAuth = true;
      state.token = action.payload;
    },
    // Перевірка токена вручну
    checkToken: (state) => {
      if (state.token && isTokenExpired(state.token)) {
        state.isAuth = false;
        state.token = '';
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(signInAsync.fulfilled, (state, action) => {
        state.isAuth = true;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(signInAsync.rejected, (state, action) => {
        state.isAuth = false;
        state.token = '';
        state.error = action.payload || 'Login failed';
      });
  }
});

export const { logout, setAuth, checkToken } = authSlice.actions;
export default authSlice.reducer;
