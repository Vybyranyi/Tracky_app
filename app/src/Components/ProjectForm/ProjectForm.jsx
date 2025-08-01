import React from "react";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import BigTitle from '../BigTitle/BigTitle';
import BigButton from '../BigButton/BigButton';
import styles from './ProjectForm.module.scss';
import SelectProjectManager from './SelectProjectManager/SelectProjectManager';
import { useTranslation } from "react-i18next";
import { Select } from "antd";

export default function ProjectForm({
    initialValues,
    onSubmit,
    users = [],
    isEdit
}) {
    const { t } = useTranslation();
    const validationSchema = Yup.object().shape({
        title: Yup.string()
            .required(t('projects.form.validation.title.required'))
            .min(2, t('projects.form.validation.title.min')),
        desc: Yup.string()
            .max(300, t('projects.form.validation.desc.max')),
        deadline: Yup.string()
            .required(t('projects.form.validation.deadline.required')),
        managerId: Yup.string()
            .required(t('projects.form.validation.manager.required')),
        img: Yup.string()
            .required(t('projects.form.validation.img.required')),

    });

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <BigTitle text={isEdit ? t('projects.form.editTitle') : t('projects.form.createTitle')} />
            </div>

            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values, { resetForm }) => {
                    const payload = isEdit
                        ? values
                        : { ...values, category: 'newProj' };
                    onSubmit(payload);
                    if (!isEdit) resetForm();
                }} enableReinitialize
            >
                {({ isSubmitting }) => (
                    <Form className={styles.form}>
                        <div className={styles.formGroup}>
                            <label htmlFor="img" className={styles.label}>{t('projects.form.imageSelect')}</label>
                            <Field name="img">
                                {({ field, form }) => (
                                    <Select
                                        id="img"
                                        placeholder={t('projects.form.image')}
                                        value={field.value}
                                        onChange={(value) => form.setFieldValue('img', value)}
                                        className={styles.imgSelect}
                                        style={{ height: '120px' }}
                                        options={[
                                            { value: '01', label: <img src="/projects/01.png" alt="01" height={60} /> },
                                            { value: '02', label: <img src="/projects/02.png" alt="02" height={60} /> },
                                            { value: '03', label: <img src="/projects/03.png" alt="03" height={60} /> },
                                            { value: '04', label: <img src="/projects/04.png" alt="04" height={60} /> },
                                            { value: '05', label: <img src="/projects/05.png" alt="05" height={60} /> },
                                        ]}
                                    />
                                )}
                            </Field>
                            <ErrorMessage name="img" component="div" className={styles.error} />

                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="title" className={styles.label}>
                                {t('projects.form.projectName')}
                            </label>
                            <Field
                                type="text"
                                name="title"
                                className={styles.input}
                                placeholder={t('projects.form.namePlaceholder')}
                            />
                            <ErrorMessage name="title" component="div" className={styles.error} />
                        </div>

                        <div className={styles.formGroup}>
                            <Field
                                as="textarea"
                                name="desc"
                                rows="4"
                                className={styles.textarea}
                                placeholder={t('projects.form.descriptionPlaceholder')}
                            />
                            <ErrorMessage name="desc" component="div" className={styles.error} />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="deadline" className={styles.label}>
                                {t('projects.form.deadline')}
                            </label>
                            <Field type="date" name="deadline" className={styles.input} />
                            <ErrorMessage name="deadline" component="div" className={styles.error} />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="managerId" className={styles.label}>
                                {t('projects.form.manager')}
                            </label>
                            <Field name="managerId">
                                {({ field, form }) => (
                                    <SelectProjectManager
                                        users={users}
                                        value={field.value}
                                        onChange={value => form.setFieldValue('managerId', value)}
                                    />
                                )}
                            </Field>
                            <ErrorMessage name="managerId" component="div" className={styles.error} />
                        </div>

                        <BigButton disabled={isSubmitting} text={isEdit ? t('projects.form.saveButton') : t('projects.form.createButton')} style="purple" />
                    </Form>
                )}
            </Formik>
        </div>
    )

};
