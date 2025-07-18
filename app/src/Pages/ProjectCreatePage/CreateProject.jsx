import React, { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { addProject } from '../../store/projects/projectsSlice';
import ProjectForm from "../../Components/ProjectForm/ProjectForm";
import { fetchUsers } from '../../store/Users/usersSlice';
import HelmetComponent from "../../Components/Helmet/HelmetComponent";
import { useTranslation } from "react-i18next";

export default function CreateProject() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { users } = useSelector(state => state.users);
    const { t } = useTranslation();

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    const handleCreate = (data) => {
        dispatch(addProject(data));
        navigate('/allprojects');
    };

    const initialValues = {
        title: '',
        desc: '',
        deadline: '',
        managerId: '',
    };

    return (
        <div>
            <HelmetComponent title={t('helmetTitle.createproject')} />
            <ProjectForm
                initialValues={initialValues}
                users={users}
                onSubmit={handleCreate}
                isEdit={false}
            />
        </div>
    );
};
