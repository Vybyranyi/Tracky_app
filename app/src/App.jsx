import React, { useEffect } from "react";
import styles from './App.module.scss';
import '../src/assets/styles/resetStyles.scss';
import '../src/assets/styles/colorVariables.scss';
import { Routes, Route, useLocation } from 'react-router-dom';
import AllTasks from './Pages/AllTasks/AllTasks';
import Header from './Components/Header/Header';
import AllProjects from './Pages/AllProjects/AllProjects';
import DetailProjectPage from './Pages/DetailProject/DetailProjectPage';
import CreateProject from "./Pages/ProjectCreatePage/CreateProject";
import TeamPage from './Pages/Team/TeamPage';
import LoginForm from "./Pages/LoginForm/LoginForm";
import CreateTask from './Pages/CreateTask/CreateTask';
import SettingsForm from './Pages/SettingsForm/SettingsForm';
import Sidebar from "./Components/Sidebar/Sidebar";
import Overview from './Pages/Overview/Overview';
import { useDispatch, useSelector } from "react-redux";
import { setAuth } from "./store/Auth/AuthSlice";
import { fetchTasks } from "./store/Tasks/TasksSlice";
import { fetchUsers } from "./store/Users/usersSlice";
import { fetchProjects } from "./store/projects/projectsSlice";
import EditProject from "./Pages/ProjectEditPage/EditProject";
import { useAuth } from "./utils/useAuth";
import CreateUser from "./Pages/CreateUser/CreateUser";


function App() {
  const { isAuth } = useSelector(state => state.auth);
  const theme = useSelector(state => state.settings.theme);

  const dispatch = useDispatch();

  const location = useLocation();
  const isFullHeader = !(location.pathname === '/team' ||
                         location.pathname === '/settings' ||
                         location.pathname === '/createuser'
                        );

  useAuth();

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      dispatch(setAuth(token));
    }
  }, [dispatch]);


  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);


  useEffect(() => {
    if (isAuth) {
      dispatch(fetchTasks());
      dispatch(fetchUsers());
      dispatch(fetchProjects());
    }
  }, [dispatch, isAuth]);

  if (!isAuth) {
    return <LoginForm />;
  }

  return (

    <div className={styles.AppWrapper}>
      <Sidebar />
      <div className={styles.MainContainer}>
        <Header isFullHeader={isFullHeader} />
        <div className={styles.pages}>
          <Routes>
            <Route path='/' element={<Overview />} />
            <Route path='/alltasks' element={<AllTasks />} />
            <Route path='/createtask' element={<CreateTask />} />
            <Route path='/allprojects' element={<AllProjects />} />
            <Route path='/createproject' element={<CreateProject />} />
            <Route path='/allprojects/:id' element={<DetailProjectPage />} />
            <Route path='/team' element={<TeamPage />} />
            <Route path='/settings' element={<SettingsForm />} />
            <Route path="/projects/edit/:_id" element={<EditProject />} />
            <Route path="/createuser" element={<CreateUser />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
