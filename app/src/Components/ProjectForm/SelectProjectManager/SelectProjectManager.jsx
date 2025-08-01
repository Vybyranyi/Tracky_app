import React from 'react';
import { Select, Avatar } from 'antd';
import styles from './SelectProjectManager.module.scss';
import { useTranslation } from 'react-i18next';
import defaultPhoto from '../../../../public/team/default-user.jpg';


const { Option } = Select;

export default function SelectProjectManager({ users, value, onChange }) {
  const managers = users.filter(user => user.role === 'manager');

  const {t} = useTranslation();

  return (
    <div className={styles.wrapper}>
    <Select
        value={value || undefined}
        placeholder={t("projects.form.managerPlaceholder")}
        onChange={onChange}
        classNames={{
            popup: {
                root: styles.dropdown,
            },
        }}
      >
        {managers.map(user => (
          <Option key={user._id} value={user._id}>
            <div className={styles.option}>
              <Avatar src={user.img ? user.img : defaultPhoto} size="small" />
              <span className={styles.name}>{user.name}</span>
            </div>
          </Option>
        ))}
    </Select>
    </div>
  );
}
