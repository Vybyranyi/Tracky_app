import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [],
  editUser: null,
};

export const fetchUsers = createAsyncThunk(
  'users',
  async (payload, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;

      const res = await fetch('http://localhost:3000/api/team', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const data = await res.json();
        return rejectWithValue(data.message || 'Failed to fetch tasks');
      }

      const data = await res.json();
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Network error');
    }
  }
);

export const addUser = createAsyncThunk(
  'users/addUser',
  async (userData, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;

      const res = await fetch('http://localhost:3000/api/team', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData)
      });

      if (!res.ok) {
        const data = await res.json();
        return rejectWithValue(data.message || 'Failed to add user');
      }

      const data = await res.json();
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Network error');
    }
  }
);

export const saveEditedUser = createAsyncThunk(
  'users/saveEditedUser',
  async (userData, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;

      const res = await fetch(`http://localhost:3000/api/team/${userData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData)
      });

      if (!res.ok) {
        const data = await res.json();
        return rejectWithValue(data.message || 'Failed to update user');
      }

      const data = await res.json();
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Network error');
    }
  }
);
export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (userId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;

      const res = await fetch(`http://localhost:3000/api/team/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const data = await res.json();
        return rejectWithValue(data.message || 'Failed to delete user');
      }

      return userId;
    } catch (err) {
      return rejectWithValue(err.message || 'Network error');
    }
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addEditUser(state, action) {
      const userId = action.payload;
      const user = state.users.find(u => u.id === userId);
      state.editUser = user ? { ...user } : null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        console.error('Error fetching users:', action.payload);
      });
    builder
      .addCase(addUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })
      .addCase(addUser.rejected, (state, action) => {
        console.error('Error adding user:', action.payload);
      });
    builder
      .addCase(saveEditedUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        state.editUser = null; // Clear editUser after saving
      })
      .addCase(saveEditedUser.rejected, (state, action) => {
        console.error('Error saving edited user:', action.payload);
      });
    builder
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(user => user.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        console.error('Error deleting user:', action.payload);
      });
  }
});

export const { addEditUser } = usersSlice.actions;

export default usersSlice.reducer;
