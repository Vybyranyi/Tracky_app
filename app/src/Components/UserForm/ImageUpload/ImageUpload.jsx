import React from 'react';
import styles from './ImageUpload.module.scss';
import { useTranslation } from 'react-i18next';

export default function ImageUpload({ value, onChange }) {

  const { t } = useTranslation();

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('https://tracky-server.onrender.com/api/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Помилка завантаження файлу');
      }

      const data = await res.json();
      const imageUrl = data.url;
      onChange(imageUrl);
    } catch (err) {
      console.error('Upload error:', err);
    }
  };

  return (
    <div className={styles.imageUploadContainer}>
      <label htmlFor="file-upload" className={styles.customFileUpload}>{t('team.form.addimg')}</label>
      <input
        id="file-upload"
        type="file"
        onChange={handleUpload}
        className={styles.hiddenFileInput}
      />
      {value && (
        <div className={styles.imagePreview}>
          <img src={value} alt="Preview" className={styles.previewImage} />
        </div>
      )}
    </div>
  );
};

