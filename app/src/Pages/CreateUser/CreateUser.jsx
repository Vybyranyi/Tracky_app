import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import UserForm from '../../Components/UserForm/UserForm';
import { addUser, saveEditedUser } from '../../store/Users/usersSlice';
import HelmetComponent from '../../Components/Helmet/HelmetComponent';
import { useTranslation } from 'react-i18next';


export default function CreateUser() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const { editUser } = useSelector(state => state.users);

    const emptyValues = {
        img: null,
        name: '',
        job: '',
        desc: '',
        role: '',
    };

    const isEdit = !!editUser;
    const initialValues = isEdit
        ? { ...emptyValues, ...editUser }
        : emptyValues;

    const handleSubmit = (data) => {
        if (isEdit) {
            dispatch(saveEditedUser(data));
            navigate('/team');
        } else {
            dispatch(addUser(data));
            navigate('/team');
        }
    };

    return (
        <div>
            <HelmetComponent title={isEdit ? t('helmetTitle.edituser') : t('helmetTitle.createuser')} />
            <UserForm
                initialValues={initialValues}
                onSubmit={handleSubmit}
                isEdit={isEdit}
            />
        </div>
    );
}