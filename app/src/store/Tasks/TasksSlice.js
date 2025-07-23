import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

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
        const res = await fetch('http://localhost:3000/api/tasks', {
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
    changeTaskStatus(state, action) {
      const { _id, status } = action.payload;
      const task = state.tasks.find(task => task._id === _id);
      task.status = status;
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
    addTask(state, action) {
      const newTask = action.payload;
      state.tasks.push(newTask);
    },
    addEditTask(state, action) {
      // записквати в editTask 
      const taskId = action.payload;
      const task = state.tasks.find(t => t._id === taskId);
      state.editTask = task ? { ...task } : null;
    },
    saveEditedTask(state, action) {
      // зберігаєш відредагований такс 
      const editedTask = action.payload;
      const index = state.tasks.findIndex(t => t._id === editedTask._id);
      if (index !== -1) {
        state.tasks[index] = editedTask;
      }
      state.editTask = null;
    },
    deleteTask(state, action) {
      state.tasks = state.tasks.filter(item => item._id !== action.payload);
    },
    filterTasks: (state, action) =>{
			if(action.payload){
				state.filtred.isFiltred = true;
			}else{
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
  }
  // extraReducers: builder => {
  //   builder
  //     .addCase(fetchTasks.fulfilled, (state, action) => {
  //       state.tasks = action.payload;
  //     })
  //     .addCase(fetchTasks.rejected, (state, action) => {
  //       console.error('Помилка при завантаженні задач:', action.payload);
  //     });
  // }
})


export const {
  setSearchValue,
  setActiveStatus,
  toggleSort,
  changeTaskStatus,
  setExtendetRow,
  deleteTask,
  searchByDate,
  addEditTask,
  saveEditedTask,
  filterTasks,
  addTask,
} = tasksSlice.actions;

export default tasksSlice.reducer;