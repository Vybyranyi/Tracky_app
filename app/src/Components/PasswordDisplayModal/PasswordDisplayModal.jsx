import React from 'react';
import styles from './PasswordDisplayModal.module.scss';
import { useTranslation } from 'react-i18next';

const PasswordDisplayModal = ({ isOpen, onClose, email, password, titleKey = 'admin.userCreated' }) => {
    const { t } = useTranslation();

    if (!isOpen) return null;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(password);
        // Optional: Show toast or feedback
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2 className={styles.modalTitle}>{t(titleKey)}</h2>
                <div className={styles.infoBlock}>
                    <p className={styles.infoLabel}>{t('auth.emailLabel')}:</p>
                    <p className={styles.infoValue}>{email}</p>
                </div>
                <div className={styles.infoBlock}>
                    <p className={styles.infoLabel}>{t('auth.passwordLabel')}:</p>
                    <div className={styles.passwordContainer}>
                        <p className={styles.passwordValue}>{password}</p>
                        <button onClick={copyToClipboard} className={styles.copyButton} title={t('admin.copyPassword')}>
                            <i className="fa-solid fa-copy"></i>
                        </button>
                    </div>
                </div>

                <div className={styles.warningBlock}>
                    <i className="fa-solid fa-triangle-exclamation"></i>
                    <p>{t('admin.savePasswordWarning')}</p>
                </div>

                <button onClick={onClose} className={styles.closeButton}>
                    {t('common.close')}
                </button>
            </div>
        </div>
    );
};

export default PasswordDisplayModal;
