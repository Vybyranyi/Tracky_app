import React from 'react';
import styles from './TeamItem.module.scss';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { filterProjects } from '../../../store/projects/projectsSlice';
import { filterTasks } from '../../../store/Tasks/TasksSlice';
import { Dropdown } from 'antd';
import { addEditUser, deleteUser } from '../../../store/Users/usersSlice';
import defaultPhoto from '../../../../public/team/default-user.jpg';


function TeamItem({ obj }) {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	let amount;

	const projects = useSelector(state => state.projects.projectsList);
	const tasks = useSelector(state => state.tasks.tasks);

    const getUserOptions = (user) => [
        {
            key: 'edit',
            label: (
                <span className={styles.dropdownItem}>
                    <i className="fa-solid fa-pen-to-square"></i> {t("actions.edit")}
                </span>
            ),
            onClick: (e) => {
                e.domEvent.stopPropagation();
                dispatch(addEditUser(user._id));
				console.log(user._id);
                navigate('/createuser');
            },
        },
        {
            key: 'delete',
            label: (
                <span className={styles.dropdownItem}>
                    <i className="fa-solid fa-trash"></i> {t("actions.delete")}
                </span>
            ),
            onClick: (e) => {
                e.domEvent.stopPropagation();
                dispatch(deleteUser(user._id));
                // navigate('/team');
            },
        },
    ];

	if (obj.role == 'manager') {
		amount = projects.filter(proj => proj.managerId == obj._id).length;
	} else {
		amount = tasks.filter(task => task.userId == obj._id).length;
	}

	const handleNavigate = () => {
		if (obj.role === 'manager') {
			dispatch(filterProjects(obj._id));
			navigate('/allprojects');
		} else {
			dispatch(filterTasks(obj._id));
			navigate('/alltasks')
		}

	}


	return (
		<div className={styles.card} >
			<div className={styles.person}>
				<img src={obj.img ? obj.img : defaultPhoto} alt="" />
				<div>
					<h3 className={styles.name}>{obj.name}</h3>
					{/* <p>{obj.role}</p> */}
					<p className={styles.job}>{obj.job}</p>
				</div>
			</div>
			<p className={styles.text}>{obj.desc}</p>
			<div className={styles.desc}>
				<div className={styles.task} onClick={handleNavigate}>
					<i className={styles.icon + " fa-regular fa-note-sticky"}></i>
					<p>{amount || 0} {obj.role === 'manager' ? t("team.proj") : t("team.task")}</p>
				</div>
				{/* <p className={styles.rating}>{obj.rating} ({obj.reviews} Reviews)</p> */}
			</div>
			<Dropdown
				className={styles.dropdown}
				menu={{ items: getUserOptions(obj) }}
				trigger={['click']}
				getPopupContainer={(triggerNode) => triggerNode.parentNode}
			>
				<i
					className={styles.dropdownIcon + " fa-solid fa-ellipsis-vertical"}
					// className="fa-solid fa-ellipsis-vertical"
					onClick={(e) => {
						e.stopPropagation();
						e.preventDefault();
					}}
				></i>
			</Dropdown>
		</div>
	);
}

export default TeamItem;

