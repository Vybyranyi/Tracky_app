import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { createUser, clearCreatedUser, updateUser, clearEditingUser } from '../../store/Users/UsersManagementSlice';
import HelmetComponent from '../../Components/Helmet/HelmetComponent';
import { useTranslation } from 'react-i18next';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styles from './CreateUser.module.scss';
import BigTitle from '../../Components/BigTitle/BigTitle';
import BigButton from '../../Components/BigButton/BigButton';
import PasswordDisplayModal from '../../Components/PasswordDisplayModal/PasswordDisplayModal';
import { Select } from 'antd';

export default function CreateUser() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { createdUser, isLoading, error, editingUser } = useSelector(state => state.usersManagement);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (createdUser) {
            setShowModal(true);
        }
    }, [createdUser]);

    // Clean up editing user on unmount
    useEffect(() => {
        return () => {
            dispatch(clearEditingUser());
        };
    }, [dispatch]);

    const handleCloseModal = () => {
        setShowModal(false);
        dispatch(clearCreatedUser());
        navigate('/usermanagement');
    };

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .email(t('auth.validation.email.format') || 'Invalid email format')
            .required(t('auth.validation.email.required') || 'Email is required'),
        name: Yup.string()
            .required(t('team.form.requiredname'))
            .min(2, t('team.form.minname')),
        job: Yup.string()
            .required(t('team.form.requiredjob'))
            .min(2, t('team.form.minjob')),
        role: Yup.string()
            .required(t('team.form.requiredrole')),
    });

    const isEdit = !!editingUser;

    return (
        <div className={styles.container}>
            <HelmetComponent title={isEdit ? t('helmetTitle.edituser') : t('admin.createUser')} />
            <div className={styles.wrapper}>
                <BigTitle text={isEdit ? t('helmetTitle.edituser') : t('admin.createUser')} />

                <Formik
                    initialValues={{
                        email: editingUser?.email || '',
                        name: editingUser?.name || '',
                        job: editingUser?.job || '',
                        role: editingUser?.role || 'user'
                    }}
                    enableReinitialize
                    validationSchema={validationSchema}
                    onSubmit={(values) => {
                        if (isEdit) {
                            dispatch(updateUser({ id: editingUser._id, ...values }))
                                .unwrap()
                                .then(() => navigate('/usermanagement'));
                        } else {
                            dispatch(createUser(values));
                        }
                    }}
                >
                    {({ setFieldValue, values }) => (
                        <Form className={styles.form}>
                            <div className={styles.formGroup}>
                                <label htmlFor="email" className={styles.label}>{t('auth.emailLabel')}</label>
                                <Field
                                    type="email"
                                    name="email"
                                    className={styles.input}
                                    placeholder={t('auth.emailPlaceholder')}
                                />
                                <ErrorMessage name="email" component="div" className={styles.error} />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="name" className={styles.label}>{t('team.form.username')}</label>
                                <Field
                                    type="text"
                                    name="name"
                                    className={styles.input}
                                    placeholder={t('team.form.enterusername')}
                                />
                                <ErrorMessage name="name" component="div" className={styles.error} />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="job" className={styles.label}>{t('team.form.job')}</label>
                                <Field
                                    type="text"
                                    name="job"
                                    className={styles.input}
                                    placeholder={t('team.form.enterjob')}
                                />
                                <ErrorMessage name="job" component="div" className={styles.error} />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="role" className={styles.label}>{t('admin.role')}</label>
                                <Select
                                    value={values.role}
                                    className={styles.customSelect}
                                    onChange={(value) => setFieldValue('role', value)}
                                    options={[
                                        { value: 'admin', label: t('roles.admin') || 'Admin' },
                                        { value: 'manager', label: t('team.manager') || 'Manager' },
                                        { value: 'developer', label: t('team.developer') || 'Developer' },
                                    ]}
                                />
                                <ErrorMessage name="role" component="div" className={styles.error} />
                            </div>

                            {error && <p className={styles.apiError}>{error}</p>}

                            <BigButton
                                text={isLoading ? t('common.loading') : (isEdit ? t('team.form.updateuser') : t('admin.createUser'))}
                                style="purple"
                                type="submit"
                                disabled={isLoading}
                            />
                        </Form>
                    )}
                </Formik>
            </div>

            <PasswordDisplayModal
                isOpen={showModal}
                onClose={handleCloseModal}
                email={createdUser?.user?.email}
                password={createdUser?.generatedPassword}
            />
        </div>
    );
}