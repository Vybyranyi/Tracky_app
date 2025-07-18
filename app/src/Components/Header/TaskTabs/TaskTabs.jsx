import styles from './TaskTabs.module.scss';
import React from "react"
import { useDispatch, useSelector } from 'react-redux';
import { setActiveStatus } from '../../../store/Tasks/TasksSlice';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';


export default function TaskTabs() {

  const navigate = useNavigate();

  const { t } = useTranslation();

  const tabs = [
    { text: t('tabs.all'), dispatch: '' },
    { text: t('tasks.status.Approved'), dispatch: 'Approved' },
    { text: t('tasks.status.Re work'), dispatch: 'Re work' },
    { text: t('tasks.status.Pending'), dispatch: 'Pending' },
    { text: t('tasks.status.In progress'), dispatch: 'In progress' },
  ];

  const dispatch = useDispatch();
  const activeStatus = useSelector((state) => state.tasks.activeStatus);

  return (
    <div className={styles.taskTabs}>
      {tabs.map((tab) => (
        <button
          key={tab.text}
          type="button"
          className={`${styles.taskTabsBtn} ${activeStatus === tab.dispatch ? styles.active : ''}`}
          onClick={() => {
            dispatch(setActiveStatus(tab.dispatch))
            navigate('/alltasks')
          }}
        >
          {tab.text}
        </button>
      ))}
    </div>
  );
}
