import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, deleteUser, resetUserPassword, clearResetPasswordResult, setEditingUser } from '../../store/Users/UsersManagementSlice';
import styles from './UserManagement.module.scss';
import { useTranslation } from 'react-i18next';
import HelmetComponent from '../../Components/Helmet/HelmetComponent';
import { useNavigate } from 'react-router-dom';
import PasswordDisplayModal from '../../Components/PasswordDisplayModal/PasswordDisplayModal';

const UserManagement = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { users, isLoading, error, resetPasswordResult } = useSelector(state => state.usersManagement);
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    useEffect(() => {
        if (resetPasswordResult) {
            setShowPasswordModal(true);
        }
    }, [resetPasswordResult]);

    const handleDelete = (id) => {
        if (window.confirm(t('admin.confirmDelete'))) {
            dispatch(deleteUser(id));
        }
    };

    const handleResetPassword = (id) => {
        if (window.confirm(t('admin.confirmResetPassword'))) {
            dispatch(resetUserPassword(id));
        }
    };

    const handleEdit = (user) => {
        dispatch(setEditingUser(user));
        navigate('/createuser');
    };

    const closePasswordModal = () => {
        setShowPasswordModal(false);
        dispatch(clearResetPasswordResult());
    };

    return (
        <div className={styles.container}>
            <HelmetComponent title={t('helmetTitle.userManagement')} />
            <div className={styles.header}>
                <h1 className={styles.title}>{t('admin.userManagement')}</h1>
                <button className={styles.createButton} onClick={() => navigate('/createuser')}>
                    <i className="fa-solid fa-plus"></i> {t('admin.createNewUser')}
                </button>
            </div>

            {isLoading && <p>Loading...</p>}
            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.tableContainer}>
                <table className={styles.usersTable}>
                    <thead>
                        <tr>
                            <th>{t('auth.emailLabel')}</th>
                            <th>{t('team.form.username')}</th>
                            <th>{t('admin.role')}</th>
                            <th>{t('admin.createdDate')}</th>
                            <th>{t('admin.actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id}>
                                <td>{user.email}</td>
                                <td>{user.name}</td>
                                <td>
                                    <span className={`${styles.roleBadge} ${styles[user.role]}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                <td className={styles.actions}>
                                    <button
                                        className={styles.actionButton}
                                        onClick={() => handleEdit(user)}
                                        title={t('actions.edit')}
                                    >
                                        <i className="fa-solid fa-pen"></i>
                                    </button>
                                    <button
                                        className={styles.actionButton}
                                        onClick={() => handleResetPassword(user._id)}
                                        title={t('admin.resetPassword')}
                                    >
                                        <i className="fa-solid fa-key"></i>
                                    </button>
                                    <button
                                        className={`${styles.actionButton} ${styles.delete}`}
                                        onClick={() => handleDelete(user._id)}
                                        title={t('common.delete')}
                                    >
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <PasswordDisplayModal
                isOpen={showPasswordModal}
                onClose={closePasswordModal}
                email={resetPasswordResult?.email} // Assuming backend returns email in reset result, or we can find it in users
                password={resetPasswordResult?.generatedPassword}
                titleKey="admin.passwordResetSuccess"
            />
        </div>
    );
};

export default UserManagement;
