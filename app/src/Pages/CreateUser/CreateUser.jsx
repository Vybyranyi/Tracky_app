import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import UserForm from '../../Components/UserForm/UserForm';
import { addUser, saveEditedUser } from '../../store/Users/usersSlice';


export default function CreateUser() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { editUser } = useSelector(state => state.users);

    const emptyValues = {
        avatar: null,
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
            console.log(data);
            navigate('/team');
        } else {
            dispatch(addUser(data));
            console.log(data);
            navigate('/team');
        }
    };

    return (
        <div>
            <UserForm
                initialValues={initialValues}
                onSubmit={handleSubmit}
                isEdit={isEdit}
            />
        </div>
    );
}