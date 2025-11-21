import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const API_URL = import.meta.env.VITE_API_URL || 'https://tracky-server.onrender.com';

const initialState = {
  tasks: [],
  searchValue: '',
  activeStatus: '',
  sortField: null,
  sortDirection: null,
  expandedRows: [],
  searchDate: '',
  editTask: null,
  filtred: {
    isFiltred: false,
    filtredBy: null
  }

};

export const fetchTasks = createAsyncThunk('tasks/fetch', async (_, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token;
    const res = await fetch(`${API_URL}/tasks`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!res.ok) {
      const data = await res.json();
      return rejectWithValue(data.message || 'Error fetching tasks');
    }

    const data = await res.json();
    return data;
  } catch (err) {
    return rejectWithValue(err.message || 'Network error');
  }
}
);

export const addTask = createAsyncThunk('tasks/add', async (task, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token;
    const res = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(task)
    });

    if (!res.ok) {
      const data = await res.json();
      return rejectWithValue(data.message || 'Error adding task');
    }

    const data = await res.json();
    return data;
  } catch (err) {
    return rejectWithValue(err.message || 'Network error');
  }
});

export const saveEditedTask = createAsyncThunk('tasks/saveEdited', async (task, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token;
    const res = await fetch(`${API_URL}/tasks/${task._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(task)
    });

    if (!res.ok) {
      const data = await res.json();
      return rejectWithValue(data.message || 'Error saving task');
    }

    const data = await res.json();
    return data;
  } catch (err) {
    return rejectWithValue(err.message || 'Network error');
  }
});

export const changeTaskStatus = createAsyncThunk('tasks/changeStatus', async ({ _id, status }, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token;
    const res = await fetch(`${API_URL}/tasks/changeStatus/${_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });

    if (!res.ok) {
      const data = await res.json();
      return rejectWithValue(data.message || 'Error changing task status');
    }

    const data = await res.json();
    return data;
  } catch (err) {
    return rejectWithValue(err.message || 'Network error');
  }
});

export const deleteTask = createAsyncThunk('tasks/delete', async (taskId, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token;
    const res = await fetch(`${API_URL}/tasks/${taskId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!res.ok) {
      const data = await res.json();
      return rejectWithValue(data.message || 'Error deleting task');
    }

    return taskId;
  } catch (err) {
    return rejectWithValue(err.message || 'Network error');
  }
});

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setSearchValue(state, action) {
      state.searchValue = action.payload;
    },
    setActiveStatus(state, action) {
      state.activeStatus = action.payload;
    },
    toggleSort(state, action) {
      const field = action.payload;
      if (state.sortField !== field) {
        state.sortField = field;
        state.sortDirection = 'asc';
      } else if (state.sortDirection === 'asc') {
        state.sortDirection = 'desc';
      } else {
        state.sortField = null;
        state.sortDirection = null;
      }
    },
    setExtendetRow(state, action) {
      const _id = action.payload;
      const index = state.expandedRows.indexOf(_id);
      if (index === -1) {
        state.expandedRows.push(_id);
      } else {
        state.expandedRows.splice(index, 1);
      }
    },
    searchByDate(state, action) {
      const date = action.payload;
      if (state.searchDate === date) {
        state.searchDate = '';
      } else {
        state.searchDate = date;
      }
    },
    addEditTask(state, action) {
      // записквати в editTask 
      const taskId = action.payload;
      const task = state.tasks.find(t => t._id === taskId);
      state.editTask = task ? { ...task } : null;
    },
    filterTasks: (state, action) => {
      if (action.payload) {
        state.filtred.isFiltred = true;
      } else {
        state.filtred.isFiltred = false;
      }
      state.filtred.filtredBy = action.payload;
    }

  },
  extraReducers: builder => {
    builder
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        console.error('Помилка при завантаженні задач:', action.payload);
      });
    builder
      .addCase(addTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })
      .addCase(addTask.rejected, (state, action) => {
        console.error('Помилка при додаванні задачі:', action.payload);
      });
    builder
      // ...existing cases...
      .addCase(changeTaskStatus.fulfilled, (state, action) => {
        const updatedTask = action.payload;
        const idx = state.tasks.findIndex(t => t._id === updatedTask._id);
        if (idx !== -1) {
          state.tasks[idx] = updatedTask;
        }
      })
      .addCase(changeTaskStatus.rejected, (state, action) => {
        console.error('Помилка при зміні статусу задачі:', action.payload);
      });
    builder
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(task => task._id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        console.error('Помилка при видаленні задачі:', action.payload);
      });
  }
})


export const {
  setSearchValue,
  setActiveStatus,
  toggleSort,
  setExtendetRow,
  searchByDate,
  addEditTask,
  filterTasks,
} = tasksSlice.actions;

export default tasksSlice.reducer;