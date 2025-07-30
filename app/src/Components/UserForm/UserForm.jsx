import React from 'react';
import styles from './UserForm.module.scss';
import * as Yup from 'yup';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import BigTitle from '../BigTitle/BigTitle';
import BigButton from '../BigButton/BigButton';
import { Select } from 'antd';
import { useTranslation } from 'react-i18next';
import ImageUpload from './ImageUpload/ImageUpload';

export default function UserForm({ initialValues, onSubmit, isEdit }) {

    const { t } = useTranslation();

    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .required(t('team.form.requiredname'))
            .min(2, t('team.form.minname')),
        job: Yup.string()
            .required(t('team.form.requiredjob'))
            .min(2, t('team.form.minjob')),
        desc: Yup.string()
            .required(t('team.form.requireddescription'))
            .max(300, t('team.form.maxdescription')),
        role: Yup.string()
            .required(t('team.form.requiredrole')),
    });

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <BigTitle text={isEdit ? t('helmetTitle.edituser') : t('helmetTitle.createuser')} />
            </div>

            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values, { resetForm }) => {
                    const payload = isEdit
                        ? values
                        : {
                            ...values,
                            // img: '01',

                        };
                    onSubmit(payload);
                    if (!isEdit) resetForm();
                }}
                enableReinitialize
            >
                {({ values = {}, setFieldValue }) => (
                    <Form className={styles.form}>
                        <div className={styles.formGroup}>
                            <ImageUpload
                                value={values.img}
                                onChange={(url) => setFieldValue('img', url)}
                            />
                            <ErrorMessage name="img" component="div" className={styles.error} />
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
                            <Field
                                as="textarea"
                                name="desc"
                                rows="4"
                                className={styles.textarea}
                                placeholder={t('team.form.enterdescription')}
                            />
                            <ErrorMessage name="desc" component="div" className={styles.error} />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="role" className={styles.label}>{t('team.form.role')}</label>
                            <Select
                                value={values.role || undefined}
                                placeholder={t('team.form.selectrole')}
                                className={styles.customSelect}
                                onChange={(value) => setFieldValue('role', value)}
                                options={[
                                    { value: 'manager', label: t('team.manager') },
                                    { value: 'developer', label: t('team.developer') },
                                ]}
                                allowClear
                            />
                            <ErrorMessage name="role" component="div" className={styles.error} />
                        </div>

                        <BigButton text={isEdit ? t('team.form.updateuser') : t('team.form.createuser')} style="purple" />
                    </Form>
                )}
            </Formik>
        </div>
    )
}