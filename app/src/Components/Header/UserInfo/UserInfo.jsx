import styles from './UserInfo.module.scss';
import SmallTitle from '../../SmallTitle/SmallTitle';
import React, { useEffect } from "react"
import { Dropdown } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../store/Auth/AuthSlice';
import { useTranslation } from 'react-i18next';
import { fetchUserProfile } from '../../../store/Auth/AuthSlice';


export default function UserInfo() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { userProfile, isAuth } = useSelector(state => state.auth);

    useEffect(() => {
        if (isAuth && !userProfile) {
            dispatch(fetchUserProfile());
        }
    }, [dispatch, isAuth, userProfile]);

    const items = [
        {
            label: (
                <button onClick={() => dispatch(logout())}>
                    <i className="fa-solid fa-arrow-right-to-bracket"></i> {t("header.logout")}
                </button>
            ),
            key: 'logout',
        },
    ];

    const displayName = userProfile?.name || userProfile?.email?.split('@')[0] || 'User';

    return (
        <div className={styles.userInfo}>
            <div className={styles.userInfoLeft}>
                <SmallTitle text={`${t('header.greeting')} ${displayName}!`} />
                <h6 className={styles.userInfoSubtitle}>{t('header.taskReminder')}</h6>
            </div>
            <div className={styles.userInfoRight}>
                <Dropdown menu={{ items }} trigger={['click']}>
                    <img className={styles.userPhoto} src={`/team/default-user.jpg`} alt="User photo" />
                </Dropdown>
            </div>
        </div>
    )
}