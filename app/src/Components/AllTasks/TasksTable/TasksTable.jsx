import React, { useEffect } from 'react';
import styles from './TasksTable.module.scss';
import { Empty, Dropdown } from "antd";
import StatusButton from '../StatusButton/StatusButton';
import { toggleSort, deleteTask, changeTaskStatus, setExtendetRow, filterTasks, addEditTask, fetchTasks } from '../../../store/Tasks/TasksSlice';
import { useDispatch, useSelector } from 'react-redux';
import { t } from 'i18next';
import BigButton from '../../BigButton/BigButton';
import { useNavigate } from 'react-router-dom';



export default function TasksTable({ tasks, isProjectsTasks = false }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(fetchTasks());
    }, []);

    const sortField = useSelector((state) => state.tasks.sortField);
    const sortDirection = useSelector((state) => state.tasks.sortDirection);
    const activeStatus = useSelector((state) => state.tasks.activeStatus);
    const searchValue = useSelector((state) => state.tasks.searchValue);
    const expandedRows = useSelector((state) => state.tasks.expandedRows);
    const searchDate = useSelector((state) => state.tasks.searchDate);
    const projects = useSelector(state => state.projects.projectsList);
    const filtred = useSelector(state => state.tasks.filtred);


    // Обробка кліку по заголовку таблиці для сортування
    const handleSort = (field) => {
        dispatch(toggleSort(field));
    };

    // Створюємо копію tasks
    let displayedTasks = [...tasks];

    if (!isProjectsTasks) {
        displayedTasks = displayedTasks.map(task => {
            const taskId = task.projectId;
            const project = projects.find(proj => proj._id == taskId);

            const projectName = project ? project.title : 'Unknown';
            const newTask = { ...task, projectName };
            return newTask;
        })
    }


    if (searchValue) {
        displayedTasks = displayedTasks.filter(task =>
            task.title.toLowerCase().includes(searchValue.toLowerCase())
        );
    }

    // Якщо передано фільтр — фільтруємо таски за статусом
    if (activeStatus) {
        displayedTasks = displayedTasks.filter(task =>
            task.status.toLowerCase() === activeStatus.toLowerCase()
        );
    }

    // Якщо вибрано поле сортування — сортуємо масив displayedTasks
    if (sortField && sortDirection) {
        displayedTasks.sort((a, b) => {
            const dateA = new Date(a[sortField]);
            const dateB = new Date(b[sortField]);

            return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
        });
    }

    if (searchDate) {
        displayedTasks = displayedTasks.filter(task =>
            task.duoDate === searchDate
        )
    };

    if (filtred.isFiltred) {
        displayedTasks = displayedTasks.filter(task => task.userId == filtred.filtredBy)
    }

    // Форматування дати
    function formatDate(dateStr) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', options);
    }

    // Опції для випадаючого меню в колонці Action
    const getTaskOptions = (task) => [
        {
            key: 'edit',
            label: (
                <span className={styles.dropdownItem}>
                    <i className="fa-solid fa-pen-to-square"></i> {t("actions.edit")}
                </span>
            ),
            onClick: (e) => {
                e.domEvent.stopPropagation();
                dispatch(addEditTask(task._id));
                navigate('/createtask');
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
                dispatch(deleteTask(task._id));
            },
        },
    ];

    const getTaskStatuses = (task) => [
        {
            key: 'Approved',
            label: (
                <StatusButton text='Approved' />
            ),
            onClick: (e) => {
                e.domEvent.stopPropagation();
                dispatch(changeTaskStatus({ _id: task._id, status: 'Approved' }))
            }
        },
        {
            key: 'Re work',
            label: (
                <StatusButton text='Re work' />
            ),
            onClick: (e) => {
                e.domEvent.stopPropagation();
                dispatch(changeTaskStatus({ _id: task._id, status: 'Re work' }))
            }
        },
        {
            key: 'Pending',
            label: (
                <StatusButton text='Pending' />
            ),
            onClick: (e) => {
                e.domEvent.stopPropagation();
                dispatch(changeTaskStatus({ _id: task._id, status: 'Pending' }))
            }
        },
        {
            key: 'In progress',
            label: (
                <StatusButton text='In progress' />
            ),
            onClick: (e) => {
                e.domEvent.stopPropagation();
                dispatch(changeTaskStatus({ _id: task._id, status: 'In progress' }))
            }
        },
    ]

    const handleShowAll = () => {
        dispatch(filterTasks());
        displayedTasks = [...tasks];
    }


    return (
        <>
            {displayedTasks.length === 0 ? (
                <Empty />
            ) : (
                <table className={styles.tasksTable}>
                    <colgroup>
                        <col className={styles.colTitle} />
                        <col className={styles.colDate} />
                        <col className={styles.colDate} />
                        <col className={styles.colDate} />
                        <col className={styles.colDate} />
                        <col className={styles.colAction} />
                    </colgroup>
                    <thead>
                        <tr className={styles.tableHeadRow}>
                            <td>
                                <div className={styles.cellContent}>
                                    {t('tasks.table.taskName')}
                                </div>
                            </td>
                            <td onClick={() => handleSort('taskCreated')} className={styles.sortColumn}>
                                {t('tasks.table.taskCreated')}
                                {sortField === 'taskCreated' && (
                                    <span>
                                        {sortDirection === 'asc'
                                            ? <i className="fa-solid fa-arrow-up"></i>
                                            : <i className="fa-solid fa-arrow-down"></i>
                                        }
                                    </span>
                                )}
                            </td>
                            <td onClick={() => handleSort('duoDate')} className={styles.sortColumn}>
                                {t('tasks.table.duoDate')}
                                {sortField === 'duoDate' && (
                                    <span>
                                        {sortDirection === 'asc'
                                            ? <i className="fa-solid fa-arrow-up"></i>
                                            : <i className="fa-solid fa-arrow-down"></i>
                                        }
                                    </span>
                                )}
                            </td>
                            {!isProjectsTasks && <td>{t('tasks.table.project')}</td>}
                            <td>{t('tasks.table.status')}</td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        {displayedTasks.map((task, index) => (
                            <React.Fragment key={index}>
                                <tr
                                    className={styles.tableRow}
                                    onClick={() => dispatch(setExtendetRow(task._id))}
                                    style={
                                        expandedRows.length !== 0 && !expandedRows.includes(task._id)
                                            ? { backgroundColor: 'transparent' }
                                            : {}
                                    }
                                >
                                    <td>
                                        <div className={styles.cellContent}>
                                            <span>{task.title}</span>
                                        </div>
                                    </td>
                                    <td>{formatDate(task.taskCreated)}</td>
                                    <td>{formatDate(task.duoDate)}</td>
                                    {isProjectsTasks ? '' : <td onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/allprojects/${task.projectId}`);
                                        // to={`/allprojects/${obj.id}`}
                                    }}>{task.projectName}</td>}
                                    <td>
                                        <Dropdown
                                            menu={{ items: getTaskStatuses(task) }}
                                            trigger={['click']}
                                            getPopupContainer={(triggerNode) => triggerNode.parentNode}
                                        >
                                            <span
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                }}
                                            >
                                                <StatusButton text={task.status} />
                                            </span>
                                        </Dropdown>
                                    </td>
                                    <td>
                                        <Dropdown
                                            menu={{ items: getTaskOptions(task) }}
                                            trigger={['click']}
                                            getPopupContainer={(triggerNode) => triggerNode.parentNode}
                                        >
                                            <i
                                                className="fa-solid fa-ellipsis-vertical"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                }}
                                            ></i>
                                        </Dropdown>


                                    </td>
                                </tr>
                                {expandedRows.includes(task._id) && (
                                    <tr className={styles.accordionRow}>
                                        <td colSpan={6}>
                                            <p className={styles.accordionContent}>{task.description}</p>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            )}
            {filtred.isFiltred && <div className={styles.showBtn}>
                <BigButton style='purple' text={t("show")} onClick={handleShowAll} />
            </div>}
        </>
    );
}
