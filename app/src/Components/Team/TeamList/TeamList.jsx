import React, { useEffect } from 'react';
import styles from './TeamList.module.scss';
import TeamItem from '../TeamItem/TeamItem';
import SmallTitle from '../../SmallTitle/SmallTitle';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { fetchUsers } from '../../../store/Users/usersSlice';
import BigButton from '../../BigButton/BigButton';
import { useNavigate } from 'react-router-dom';

function TeamList(props) {

	const { t } = useTranslation();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const team = useSelector(state => state.users.users);

	useEffect(() => {
		dispatch(fetchUsers());
	}, []);

	return (
		<div className={styles.wrapper}>
			<div className={styles.usersHeader}>
				<SmallTitle text={t("team.title")} className={styles.TeamTitle} />
				<BigButton text='add_user' style="purple" onClick={() => navigate('/createuser')}/>
			</div>
			<div className={styles.list}>
				{team.map(item => <TeamItem obj={item} key={item.name} />)}
			</div>
		</div>
	);
}



export default TeamList;