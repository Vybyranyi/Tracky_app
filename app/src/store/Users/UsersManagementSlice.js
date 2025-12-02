import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const getAuthHeader = () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const fetchUsers = createAsyncThunk(
    'usersManagement/fetchUsers',
    async (_, { rejectWithValue }) => {
        try {
            const res = await fetch(`${API_URL}/admin/users`, {
                headers: getAuthHeader()
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to fetch users');
            return data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

export const createUser = createAsyncThunk(
    'usersManagement/createUser',
    async (userData, { rejectWithValue }) => {
        try {
            const res = await fetch(`${API_URL}/admin/users`, {
                method: 'POST',
                headers: getAuthHeader(),
                body: JSON.stringify(userData)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to create user');
            return data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

export const updateUser = createAsyncThunk(
    'usersManagement/updateUser',
    async ({ id, ...updates }, { rejectWithValue }) => {
        try {
            const res = await fetch(`${API_URL}/admin/users/${id}`, {
                method: 'PUT',
                headers: getAuthHeader(),
                body: JSON.stringify(updates)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to update user');
            return data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

export const deleteUser = createAsyncThunk(
    'usersManagement/deleteUser',
    async (id, { rejectWithValue }) => {
        try {
            const res = await fetch(`${API_URL}/admin/users/${id}`, {
                method: 'DELETE',
                headers: getAuthHeader()
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Failed to delete user');
            }
            return id;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

export const resetUserPassword = createAsyncThunk(
    'usersManagement/resetUserPassword',
    async (userId, { getState, rejectWithValue }) => {
        try {
            const res = await fetch(`${API_URL}/admin/users/${userId}/reset-password`, {
                method: 'POST',
                headers: getAuthHeader()
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to reset password');
            
            // Додаємо email користувача до відповіді
            const users = getState().usersManagement.users;
            const user = users.find(u => u._id === userId);
            
            return { 
                ...data, 
                email: user?.email,
                generatedPassword: data.newPassword // Бекенд повертає newPassword
            };
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

const usersManagementSlice = createSlice({
    name: 'usersManagement',
    initialState: {
        users: [],
        isLoading: false,
        error: null,
        createdUser: null,
        resetPasswordResult: null,
        editingUser: null,
    },
    reducers: {
        clearCreatedUser: (state) => {
            state.createdUser = null;
        },
        clearResetPasswordResult: (state) => {
            state.resetPasswordResult = null;
        },
        setEditingUser: (state, action) => {
            const userId = action.payload;
            const user = state.users.find(u => u._id === userId);
            state.editingUser = user || null;
        },
        clearEditingUser: (state) => {
            state.editingUser = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(createUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.users.push(action.payload.user);
                state.createdUser = action.payload;
            })
            .addCase(createUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(updateUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.users.findIndex(u => u._id === action.payload.user._id);
                if (index !== -1) {
                    state.users[index] = action.payload.user;
                }
                state.editingUser = null;
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.users = state.users.filter(u => u._id !== action.payload);
            })
            .addCase(resetUserPassword.fulfilled, (state, action) => {
                state.resetPasswordResult = action.payload;
            });
    }
});

export const { clearCreatedUser, clearResetPasswordResult, setEditingUser, clearEditingUser } = usersManagementSlice.actions;
export default usersManagementSlice.reducer;