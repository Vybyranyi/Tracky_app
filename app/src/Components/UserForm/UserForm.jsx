import React from 'react';
import styles from './UserForm.module.scss';
import * as Yup from 'yup';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import BigTitle from '../BigTitle/BigTitle';
import BigButton from '../BigButton/BigButton';
import { Select } from 'antd';

export default function UserForm({ initialValues, onSubmit, isEdit }) {

    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .required('Name is required')
            .min(2, 'Name must be at least 2 characters long'),
        job: Yup.string()
            .required('Job is required')
            .min(2, 'Job must be at least 2 characters long'),
        desc: Yup.string()
            .required('Description is required')
            .max(300, 'Description cannot exceed 300 characters'),
        role: Yup.string()
            .required('Role is required'),
    });

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <BigTitle text={isEdit ? 'Edit User' : 'Create User'} />
            </div>

            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values, { resetForm }) => {
                    const payload = isEdit
                        ? values
                        : {
                            ...values,
                            img: '01',

                        };
                    onSubmit(payload);
                    if (!isEdit) resetForm();
                }}
                enableReinitialize
            >
                {({ values = {}, setFieldValue }) => (
                    <Form className={styles.form}>
                        <div className={styles.formGroup}>
                            <label htmlFor="name" className={styles.label}>User Name</label>
                            <Field
                                type="text"
                                name="name"
                                className={styles.input}
                                placeholder='Enter user name'
                            />
                            <ErrorMessage name="name" component="div" className={styles.error} />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="job" className={styles.label}>Job</label>
                            <Field
                                type="text"
                                name="job"
                                className={styles.input}
                                placeholder='Enter job title'
                            />
                            <ErrorMessage name="job" component="div" className={styles.error} />
                        </div>

                        <div className={styles.formGroup}>
                            <Field
                                as="textarea"
                                name="desc"
                                rows="4"
                                className={styles.textarea}
                                placeholder='Enter a description...'
                            />
                            <ErrorMessage name="desc" component="div" className={styles.error} />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="role" className={styles.label}>Role</label>
                            <Select
                                value={values.role || undefined}
                                placeholder="Select role"
                                className={styles.customSelect}
                                onChange={(value) => setFieldValue('role', value)}
                                options={[
                                    { value: 'manager', label: 'Manager' },
                                    { value: 'developer', label: 'Developer' },
                                ]}
                                allowClear
                            />
                            <ErrorMessage name="role" component="div" className={styles.error} />
                        </div>

                        <BigButton text={isEdit ? 'Update User' : 'Create User'} style="purple" />
                    </Form>
                )}
            </Formik>
        </div>
    )
}