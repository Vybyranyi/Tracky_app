import React from 'react';
import styles from './SettingsForm.module.scss';
import LanguageSelect from '../../Components/Settings/LanguageSelect/LanguageSelect';
import ThemSelect from '../../Components/Settings/ThemSelect/ThemSelect';
import { useTranslation } from 'react-i18next';
import HelmetComponent from '../../Components/Helmet/HelmetComponent';
import { useDispatch, useSelector } from 'react-redux';
import { uploadAvatar } from '../../store/Auth/AuthSlice';


const SettingsForm = () => {

  const { i18n, t } = useTranslation();
  const dispatch = useDispatch();
  const { userProfile } = useSelector(state => state.auth);

  const setLanguage = (val) => {
    i18n.changeLanguage(val);
  }

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    dispatch(uploadAvatar(file));
  };

  return (
    <div className={styles.settingsForm}>
      <HelmetComponent title={i18n.t('helmetTitle.settings')} />

      <div className={styles.profileSection}>
        <h3 className={styles.sectionTitle}>{t('settings.profile') || 'Profile'}</h3>
        <div className={styles.avatarWrapper}>
          <img
            className={styles.avatarImage}
            src={userProfile?.avatar || '/team/default-user.jpg'}
            alt="Avatar"
          />
          <label htmlFor="avatar-upload" className={styles.avatarUploadBtn}>
            <i className="fa-solid fa-camera"></i>
            {t('settings.changeAvatar') || 'Change photo'}
          </label>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={handleAvatarUpload}
            className={styles.hiddenInput}
          />
        </div>
      </div>

      <LanguageSelect value={i18n.language} onChange={setLanguage} />
      <ThemSelect />
    </div>
  );
};

export default SettingsForm;