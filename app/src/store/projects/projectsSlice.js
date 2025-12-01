import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { calculateDaysLeft } from '../../utils/calculateDaysLeft';
import { calculateProjectProgress } from '../../utils/calculateProjectProgress';

const API_URL = import.meta.env.VITE_API_URL;

export const fetchProjects = createAsyncThunk(
	'projects/fetch',
	async (_, { getState, rejectWithValue }) => {
		try {
			const token = getState().auth.token;
			const res = await fetch(`${API_URL}/projects`, {
				headers: {
					'Authorization': `Bearer ${token}`
				}
			});
			if (!res.ok) {
				const data = await res.json();
				return rejectWithValue(data.message || 'Failed to fetch projects');
			}
			const data = await res.json();

			const tasks = getState().tasks.tasks;

			const projectsByCategory = Object.fromEntries(
				Object.entries(data).map(([category, projects]) => [
					category,
					projects.map(project => ({
						...project,
						deadlineAmount: calculateDaysLeft(project.deadline),
						progress: calculateProjectProgress(tasks, project._id),
					}))
				])
			);

			return projectsByCategory;
		} catch (err) {
			return rejectWithValue(err.message || 'Network error');
		}
	}
);

export const addProject = createAsyncThunk(
	'projects/addProject',
	async (project, { getState, rejectWithValue }) => {
		const token = getState().auth.token;
		const res = await fetch(`${API_URL}/projects`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			},
			body: JSON.stringify(project)
		});
		if (!res.ok) {
			const data = await res.json();
			return rejectWithValue(data.message || 'Failed to add project');
		}
		return await res.json();
	}
);

export const updateProject = createAsyncThunk(
	'projects/updateProject',
	async ({ id, project }, { getState, rejectWithValue }) => {
		const token = getState().auth.token;
		const res = await fetch(`${API_URL}/projects/${id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			},
			body: JSON.stringify(project)
		});
		if (!res.ok) {
			const data = await res.json();
			return rejectWithValue(data.message || 'Failed to update project');
		}
		return await res.json();
	}
)

export const deleteProject = createAsyncThunk(
	'projects/deleteProject',
	async (projectId, { getState, rejectWithValue }) => {
		const token = getState().auth.token;
		const res = await fetch(`${API_URL}/projects/${projectId}`, {
			method: 'DELETE',
			headers: {
				'Authorization': `Bearer ${token}`
			}
		});
		if (!res.ok) {
			const data = await res.json();
			return rejectWithValue(data.message || 'Failed to delete project');
		}
		return projectId;
	}
)

const initialState = {
	projectsList: [],
	projectsCategories: {},
	shownBy: 'list',
	sortType: null,
	sortDirection: null,
	searchValue: '',
	filtred: {
		isFiltred: false,
		filtredBy: null
	}
}

const projectsSlice = createSlice({
	initialState,
	name: 'projects',
	reducers: {
		changeSort: (state, action) => {
			state.sortType = action.payload.type;
			state.sortDirection = action.payload.direction;
		},
		changeShown: (state, action) => {
			state.shownBy = action.payload;

			return state;
		},
		sorting: (state, action) => {
			let entries = Object.entries(state.projectsCategories);

			if (state.sortType == 'deadline') {
				if (state.sortDirection == 'increase') {
					state.projectsList = [...state.projectsList].sort((a, b) => a.deadlineAmount - b.deadlineAmount);
					state.projectsCategories = Object.fromEntries(entries.map(([key, arr]) => [key, [...arr].sort((a, b) => a.deadlineAmount - b.deadlineAmount)]));
				}
				else {
					state.projectsList = [...state.projectsList].sort((a, b) => b.deadlineAmount - a.deadlineAmount);
					state.projectsCategories = Object.fromEntries(entries.map(([key, arr]) => [key, [...arr].sort((a, b) => b.deadlineAmount - a.deadlineAmount)]));
				}
			} else {
				if (state.sortDirection == 'increase') {
					state.projectsList = [...state.projectsList].sort((a, b) => a.progress - b.progress);
					state.projectsCategories = Object.fromEntries(entries.map(([key, arr]) => [key, [...arr].sort((a, b) => a.progress - b.progress)]));
				}
				else {
					state.projectsList = [...state.projectsList].sort((a, b) => b.progress - a.progress);
					state.projectsCategories = Object.fromEntries(entries.map(([key, arr]) => [key, [...arr].sort((a, b) => b.progress - a.progress)]));
				}
			}
		},

		setSearchValue: (state, action) => {
			state.searchValue = action.payload;
			return state;
		},
		
		// editProject: (state, action) => {
		// 	const updatedProject = action.payload;
		// 	const entries = Object.entries(state.projectsCategories);

		// 	state.projectsCategories = Object.fromEntries(
		// 	  	entries.map(([key, arr]) => [
		// 			key,
		// 			arr.map(project => project.id === updatedProject.id ? updatedProject : project)
		// 	  	])
		// 	);

		// 	state.projectsList = Object.values(state.projectsCategories).flat();
		// },
		// updateProject: (state, action) => {
		// 	const updated = action.payload;
		// 	const entries = Object.entries(state.projectsCategories);
		// 	state.projectsCategories = Object.fromEntries(
		// 	  	entries.map(([key, arr]) => [
		// 			key,
		// 			arr.map((item) => (item.id === updated.id ? updated : item))
		// 	  	])
		// 	);
		// 	state.projectsList = Object.values(state.projectsCategories).flat();
		// },
		filterProjects: (state, action) => {
			if (action.payload) {
				state.filtred.isFiltred = true;
			} else {
				state.filtred.isFiltred = false;
			}
			state.filtred.filtredBy = action.payload;
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchProjects.fulfilled, (state, action) => {
				state.projectsCategories = action.payload || {};
				state.projectsList = Object.values(state.projectsCategories).flat();
			})
			.addCase(fetchProjects.rejected, (state, action) => {
				console.error('Failed to fetch projects:', action.payload);
			});

		builder
			.addCase(addProject.fulfilled, (state, action) => {
				const project = action.payload;
				const deadlineAmount = calculateDaysLeft(project.deadline);
				const newProject = { ...project, deadlineAmount };
				const category = project.category || 'newProj';
				if (state.projectsCategories[category]) {
					state.projectsCategories[category].push(newProject);
				} else {
					state.projectsCategories[category] = [newProject];
				}
				state.projectsList = Object.values(state.projectsCategories).flat();
			});

		builder
			.addCase(deleteProject.fulfilled, (state, action) => {
				const projectId = action.payload;
				const entries = Object.entries(state.projectsCategories);
				state.projectsCategories = Object.fromEntries(
					entries.map(([key, arr]) => [key, arr.filter(item => item._id !== projectId)])
				);
				state.projectsList = Object.values(state.projectsCategories).flat();
			});

		builder
			.addCase(updateProject.fulfilled, (state, action) => {
				const updatedProject = action.payload;
				const deadlineAmount = calculateDaysLeft(updatedProject.deadline);
				const progress = calculateProjectProgress(state.tasks, updatedProject._id);
				const newProject = { ...updatedProject, deadlineAmount, progress };
				const entries = Object.entries(state.projectsCategories);

				state.projectsCategories = Object.fromEntries(
					entries.map(([key, arr]) => [
						key,
						arr.map(project => project._id === updatedProject._id ? newProject : project)
					])
				);
				state.projectsList = Object.values(state.projectsCategories).flat();
			});
	}
});

export const {
	changeSort,
	changeShown,
	sorting,
	setSearchValue,
	// editProject,
	filterProjects
} = projectsSlice.actions;

export default projectsSlice.reducer;