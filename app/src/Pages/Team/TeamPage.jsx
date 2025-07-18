import React from 'react';
import TeamList from '../../Components/Team/TeamList/TeamList';
import { useTranslation } from 'react-i18next';
import HelmetComponent from '../../Components/Helmet/HelmetComponent';

function TeamPage(props) {
	const { t } = useTranslation();

	return (
		<div>
			<HelmetComponent title={t('helmetTitle.team')} />
			<TeamList />
		</div>
	);
}

export default TeamPage;