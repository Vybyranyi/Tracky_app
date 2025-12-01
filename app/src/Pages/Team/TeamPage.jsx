import React from 'react';
import TeamList from '../../Components/Team/TeamList/TeamList';
import UserManagement from '../UserManagement/UserManagement';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import HelmetComponent from '../../Components/Helmet/HelmetComponent';

function TeamPage(props) {
	const { t } = useTranslation();

	const { userRole } = useSelector(state => state.auth);

	return (
		<div>
			<HelmetComponent title={t('helmetTitle.team')} />
			{userRole === 'admin' ? <UserManagement /> : <TeamList />}
		</div>
	);
}

export default TeamPage;