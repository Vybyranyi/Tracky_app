import React, { useState } from 'react';
import styles from './SettingsForm.module.scss';
import LanguageSelect from '../../Components/Settings/LanguageSelect/LanguageSelect';
import ThemSelect from '../../Components/Settings/ThemSelect/ThemSelect';
import { useTranslation } from 'react-i18next';
import HelmetComponent from '../../Components/Helmet/HelmetComponent';


const SettingsForm = () => {

  const {i18n} = useTranslation();


  const setLanguage = (val) => {
    i18n.changeLanguage(val);
  }

  return (
    <div className={styles.settingsForm}>
      <HelmetComponent title={i18n.t('helmetTitle.settings')} />
      <LanguageSelect value={i18n.language} onChange={setLanguage} />
      <ThemSelect />
    </div>
  );
};

export default SettingsForm;