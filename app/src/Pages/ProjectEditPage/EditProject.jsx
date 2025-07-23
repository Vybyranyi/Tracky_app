import React, { useEffect, useTransition } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import ProjectForm from "../../Components/ProjectForm/ProjectForm";
import { updateProject } from "../../store/projects/projectsSlice";
import { fetchUsers } from "../../store/Users/usersSlice";
import { fetchProjects } from "../../store/projects/projectsSlice";
import HelmetComponent from "../../Components/Helmet/HelmetComponent";
import { useTranslation } from "react-i18next";

export default function EditProject() {
  const { _id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const allProjects = useSelector((state) => state.projects.projectsList);
  const { users } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch, users.length]);

  const project = allProjects.find((p) => p._id === +_id);

  const handleEdit = (data) => {
    dispatch(updateProject(data));
    navigate(`/allprojects/${data._id}`);
  };

  if (!allProjects.length || !project) return <p>Loading...</p>;

  return (
    <div>
      <HelmetComponent title={t('helmetTitle.editproject')} />

      <ProjectForm
        initialValues={project}
        onSubmit={handleEdit}
        users={users}
        isEdit={true}
      />
    </div>

  );
}
