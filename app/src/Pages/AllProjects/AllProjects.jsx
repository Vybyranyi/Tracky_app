import React, { useEffect } from 'react';
import ProjectsNavigation from '../../Components/allprojects/ProjectsNavigation/ProjectsNavigation';
import styles from './AllProjects.module.scss';
import ProjectsSlider from '../../Components/allprojects/ProjectsSlider/ProjectsSlider';
import ProjectsList from '../../Components/allprojects/ProjectsList/ProjectsList';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { selectProjectsEnriched } from '../../store/selectors/selectors';
import BigButton from '../../Components/BigButton/BigButton';
import { fetchProjects, filterProjects } from '../../store/projects/projectsSlice';
import HelmetComponent from '../../Components/Helmet/HelmetComponent';

function AllProjects() {



	const { t } = useTranslation();
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(fetchProjects());
	}, []);

	const { categories: projectsCategories } = useSelector(selectProjectsEnriched);
	const { list: projectsList } = useSelector(selectProjectsEnriched);


	const searchValue = useSelector(state => state.projects.searchValue);
	const shownBy = useSelector(state => state.projects.shownBy);
	const filtred = useSelector(state => state.projects.filtred);

	let shownProjectsList = [...projectsList];

	if (filtred.isFiltred) {
		shownProjectsList = shownProjectsList.filter(proj => proj.managerId === filtred.filtredBy);
	}

	let filteredCategories = { ...projectsCategories };

	if (searchValue) {
		filteredCategories = Object.fromEntries(
			Object.entries(projectsCategories).map(([key, arr]) => [
				key,
				arr.filter(project =>
					project.title.toLowerCase().includes(searchValue.toLowerCase())
				)
			])
		);
		shownProjectsList = Object.values(filteredCategories).flat();
	}

	const handleShowAll = () => {
		dispatch(filterProjects());
	};

	return (
		<div className={styles.container}>
			<HelmetComponent title={t('helmetTitle.allprojects')} />
			{!filtred.isFiltred ? (
				<>
					<ProjectsNavigation />
					{shownBy === 'category' ? (
						<>
							<ProjectsSlider title={t('projects.title.newProject')} projects={filteredCategories.newProj || []} />
							<ProjectsSlider title={t('projects.title.timeLimit')} projects={filteredCategories.timeLim || []} />
						</>
					) : (
						<ProjectsList arr={shownProjectsList} />
					)}
				</>
			) : (
				<>
					<ProjectsList arr={shownProjectsList} />
					<div className={styles.btn}>
						<BigButton onClick={handleShowAll} text={t('show')} style='purple' />
					</div>
				</>
			)}
		</div>
	);
}

export default AllProjects;
