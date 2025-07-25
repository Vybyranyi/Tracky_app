import React, { useState, useMemo } from 'react';
import styles from './ProjectSummary.module.scss'
import { Dropdown, Empty } from 'antd';
import StatusButton from '../AllTasks/StatusButton/StatusButton';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { getDeadlineLabel } from '../../utils/deadlineUtils';
import { selectProjectsEnriched } from '../../store/selectors/selectors';


function ProjectSummary() {
	const { t } = useTranslation();

	const {list: projects} = useSelector(selectProjectsEnriched);
	const team = useSelector(state => state.users.users);

	const [selectedProject, setSelectedProject] = useState(null);
	const [selectedManager, setSelectedManager] = useState(null);

	let displayedProjects = [...projects];

	if (selectedProject) {
		displayedProjects = displayedProjects.filter(project => project._id === selectedProject);
	}

	if (selectedManager) {
		displayedProjects = displayedProjects.filter(project => project.managerId === selectedManager);
	}

	const getProjects = () =>
		projects.map(project => ({
			key: project._id,
			label: project.title,
			onClick: () => setSelectedProject(project._id)
		}));

	const getManagers = () =>
		team.map(user => {
			if (user.role === 'manager') {
				return {
					key: user._id,
					label: user.name,
					onClick: () => setSelectedManager(user._id)
				};
			}
		});

	return (
		<div className={styles.ProjectSummaryContainer}>
			<div className={styles.ProjectSummaryHeader}>
				<h4 className={styles.ProjectSummaryTitle}>Project Summary</h4>
				<div className={styles.ProjectSummaryDropdowns}>
					<Dropdown
						menu={{ items: getProjects() }}
						trigger={['click']}
					>
						<span className={styles.dropdownElement}>
							{selectedProject ? projects.find(p => p._id === selectedProject)?.title : t('projSummary.labels.proj')}
							{selectedProject === null ?
							<i className="fa-solid fa-angle-down"></i> :
							<i className="fa-solid fa-xmark" onClick={() => setSelectedProject(null)}></i>}
						</span>
					</Dropdown>
					<Dropdown
						menu={{ items: getManagers() }}
						trigger={['click']}
					>
						<span className={styles.dropdownElement}>
							{selectedManager ? team.find(m => m._id === selectedManager)?.name : t('projSummary.labels.manager')}
							{selectedManager === null ?
							<i className="fa-solid fa-angle-down"></i> :
							<i className="fa-solid fa-xmark" onClick={() => setSelectedManager(null)}></i>}
						</span>
					</Dropdown>
					{/* <Dropdown
						menu={{ items: getStatus() }}
						trigger={['click']}
					>
						<span className={styles.dropdownElement}>
							Status<i className="fa-solid fa-angle-down"></i>
						</span>
					</Dropdown> */}
				</div>

			</div>
			{displayedProjects.length === 0 ? (
				<Empty />
			) : (
				<table className={styles.ProjectSummaryTable}>
					<thead>
						<tr>
							<th>{t('projSummary.name')}</th>
							<th>{t('projSummary.manager')}</th>
							<th>{t('projSummary.deadline')}</th>
							<th>{t('projSummary.progress')}</th>
						</tr>
					</thead>
					<tbody>
						{displayedProjects.map((project, index) => (
							<React.Fragment key={index}>
								<tr>
									<td>{project.title}</td>
									<td>{team.find(member => member._id === project.managerId)?.name || 'Unknown'}</td>
									<td>{getDeadlineLabel(project.deadlineAmount, t)}</td>
									<td>
										{project.progress}%
										{/* <Dropdown
											menu={{ items: getTaskStatuses() }}
											trigger={['click']}
											getPopupContainer={(triggerNode) => triggerNode.parentNode}
										>
											<span
												onClick={(e) => {
													e.stopPropagation();
													e.preventDefault();
												}}
											>
												<StatusButton text={'Approved'} />
											</span>
										</Dropdown> */}
									</td>
								</tr>
							</React.Fragment>
						))}


					</tbody>
				</table>
			)}

		</div>
	);
}

export default ProjectSummary;